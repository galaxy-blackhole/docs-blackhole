# Context, budgets and caching

Every model call carries a **budget** and a **layout**. Getting either wrong shows up as
cost, latency, or a run that quietly forgets what it was doing.

## Budgets

Context is assembled from weighted items into a profile:

| Profile | Character |
| --- | --- |
| `balanced` (default) | The everyday profile for large-context models |
| `conservative` | Smaller windows, larger output reserve |
| `extended` | Very large windows, more room for history |

Each profile resolves thresholds: a **tighten** point, an **eviction** point, a
**compaction** point and a hard ceiling. Pressure is classified per turn as
`normal`, `tighten`, `evict`, `compact` or `blocked` — and the run logs it, so a
context problem is visible before it becomes a failure.

When compaction triggers, the runtime writes a **durable checkpoint** and replaces
history with a bounded summary. The checkpoint is the same structure used for resume
integrity and tamper detection, which is why compaction cannot lose the evidence trail.

## Layout: why the mutable state moved last

A provider prefix cache reuses the longest identical prefix of a request. Anything that
changes near the front invalidates everything after it.

The run's mandatory state — remaining turns, edited files, phase, next action — changes
**every turn**. It used to sit right after the system policy, at the default checkpoint
order. Measured on a real flow:

| | Before | After |
| --- | --- | --- |
| Item that changed first | `runtime-mandatory-state` on **38 of 40** turns | the newest appended context item |
| Provider cache reuse | pinned at ~10.7k tokens while the context grew past 60k | 49k+ and climbing |
| Run-wide cache hit | 40% | **61%** |
| First step of the flow | 10% | 59–87% |

The fix was one ordering decision: the mutable block now sits *after* the stable prefix
(policy, goal, durable checkpoint, files, tools, history) and immediately before the new
turn's messages. That is the same advice providers give — put cached content first,
variable content last.

## Two things that look like bugs and are not

**Token counts drift.** The estimator self-calibrates against the provider's reported
usage with an exponential moving average (0.75 old / 0.25 observed, clamped), so the
*same* tool block can be counted as 7,312 tokens on one turn and 5,601 on another. The
content is identical; the estimate is learning. Use the fingerprints below, not the
counts, to decide whether something actually changed.

**Per-turn cache rate swings.** A single compaction or a checkpoint rewrite resets the
prefix legitimately. The flow report therefore shows the **cumulative** rate, and the
runtime records a per-item fingerprint every turn.

## Diagnostics

Every turn emits a context diagnostic:

```text
turn  categories { system, toolDefinitions, checkpoint, user, toolResults, … }
      pressure normal | currentInputTokens 18035 | projection …
      itemDigests [ { index, id, kind, tokens, hash }, … ]   (up to 24 items)
      toolHash    fnv1a64:28bbc94664ac8a7a
```

Diffing two consecutive turns names the item whose change reset the cache — that is
exactly how the layout bug above was found, in a log, without a profiler. The
`toolHash` is what proved the tool block was byte-identical all along while its token
count wandered.

## Practical guidance

- Long runs are cheaper with a stable system prompt: enable
  `--system-prompt-in-history` only for models verified to accept system messages in
  history (the CLI follows a verified list by default).
- Let compaction happen. It is cheaper than a run that spends its last turns re-reading
  files it can no longer fit.
- If cache hit collapses, look at the *first* item whose hash changed; the diagnostic
  tells you which one, and the answer is usually a block that should not be that early.
