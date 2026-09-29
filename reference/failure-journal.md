# Failure journal

The failures below are the reason the current release behaves the way it does. Each one
was found by running the end-to-end flow, diagnosed from logs rather than intuition, and
fixed with a regression test. The unabridged version — in Vietnamese, with raw log
excerpts — lives in
[`galaxy-code/docs/TEST_FAILURE_ANALYSIS.md`](https://github.com/galaxy-blackhole/galaxy-code/blob/main/docs/TEST_FAILURE_ANALYSIS.md).

## 1. The agent spent a step proving a dev server runs

**Symptom** — a scaffold step never finished: twelve-plus `vite`/`bun run dev`
invocations, port polling, `lsof`, `ps`, and probe files written into the workspace and
cleaned up again.

**Root cause** — a *skill* said so. The Orbit checklist read *"App boots: `bun run dev`
shows no startup errors"*. A warning added to the system prompt changed nothing; fixing
the skill did.

**Fix** — the checklist now points at `validate_project`; both bundled skills gained a
verification section; `run_command` answers server-like commands with an advisory.

**Result** — step 1 went from never completing to finishing in 65 tool calls.

## 2. A tool call failed because a timeout exceeded its cap

**Symptom** — `run_command` with `timeoutMs` above 600 000 returned
`INVALID_TOOL_ARGUMENTS`; the command never ran and a model turn was lost.

**Fix** — values above a schema maximum are clamped to the cap and the adjustment is
reported in the result. Values below a minimum, or of the wrong type, still fail.

## 3. A README edit invalidated every validation

**Symptom** — the gate refused completion with `WORKSPACE_EVIDENCE_STALE` for
validations of packages nobody had touched.

**Root cause** — staleness compared one fingerprint for the whole workspace, and every
`project.validate` was recorded with `scope: workspace` even when it ran in a
subproject.

**Fix** — validation staleness is scoped to the paths a validation covered; documentation
writes and deleted paths are exempt; untracked drift still invalidates everything.
A day of runs had contained twenty-one forced re-validations.

## 4. A run failed after its work was done

**Symptom** — `AI Coder reached maxTurns=48` immediately after the last tool result said
"Project validation passed", with eleven validations recorded.

**Fix** — reaching the turn budget grants one tool-free finalization turn; the gate
decides from the evidence that exists. The CLI also exposes `--max-turns` and
`--run-minutes`, which had been invisible limits.

## 5. Provider cache hit collapsed to 40%

**Symptom** — 1.4M input tokens re-billed across a run; cache reuse pinned at ~10.7k
tokens while the context grew past 60k.

**Root cause** — the mutable run state was the first thing to change on 38 of 40 turns,
and it sat near the front of the request.

**Fix** — the block moved after the stable prefix; per-turn item fingerprints were added
so the next regression can be named from a log. Measured: 40% → 61%.

## 6. The gate demanded validation for a file that had been deleted

**Symptom** — a scratch probe written and removed in the same step still produced
`WRITE_NOT_VALIDATED` items, forcing a pointless re-validation.

**Fix** — a path whose final state is a deletion needs no validation.

## 7. Three-hour runs died on infrastructure

**Symptoms** — a DNS outage (`ENOTFOUND`) killed a run at step 6; a security step reached
the host deadline at turn 73 with edits still landing; another outage exhausted three
retries of the *next* step.

**Fixes** — the flow harness retries transport failures and deadline exhaustion with a
fresh budget, resumes from any step, can be bounded to a range, and always writes its
report (with `fatal`, `resumedFrom`, `stoppedAfter`, `retriedSteps`). Both killed steps
later completed: 198 and 150 tool calls, zero gate rejections.

## What was *not* a bug

Recorded so nobody re-investigates:

- **Cancelled by user** — one step ended as `cancelled` with the reason logged as an
  external signal. The flow kept going; the step was re-run. (A later instance was a
  tool-call interrupt killing the process group — a harness artifact, fixed by launching
  the run detached.)
- **Dependency guard rejections** — the agent tried to grep library source; the guard
  refused and now says which read *is* allowed. Working as intended.
- **No-progress blocks** — the same call twice. Working as intended.
- **Token counts that drift between turns** — the estimator self-calibrates against
  provider usage. Content fingerprints, not counts, tell you what changed.

## One open question we chose not to paper over

The flow's step `s13-connect-api` expects the agent to consult the Galaxy UI component
catalogue. The step wires an existing page to the API: it installs no components, and it
completes correctly using the components a previous step installed. The expectation looks
too strict for that step — but weakening the flow to make a run look green would defeat
the purpose of having expectations. It stays recorded here until the flow's author
decides.
