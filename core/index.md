# Runtime architecture

`@galaxy-stack/ai-coder-core` is the engine every Galaxy host embeds. It owns the run
loop, the context, the evidence and the gate; it deliberately owns none of the
environment.

## Ports and adapters

| Port | The host supplies | The core guarantees |
| --- | --- | --- |
| **Model** | A chat model (Ollama, OpenAI-compatible, a test double) | Rounds, retries, thinking negotiation, streaming normalisation |
| **Workspace** | File reads, writes, patches, snapshots | Path scoping, atomic writes with preconditions, generated-vs-authored classification |
| **Command** | Shell execution, bounded sessions | Timeouts, output bounding, mutation observation |
| **Tool executor** | The tool set and its effect profiles | Argument clamping, registry hashing, idempotency |
| **Store / trace** | Checkpoints, logs | Durable run state, tamper-evident checkpoints |

The core is ESM-only, runs on Node 22.13+, and ships no provider, filesystem adapter,
command runner, credential store or UI.

## The run loop

1. **Prepare** — resolve capabilities, tool set, prompt snapshot and integrity hashes.
2. **Inspect** — the model works with tools until it proposes a final report.
3. **Gate** — the host evaluates the completion evidence and either finishes the run or
   answers with specific issue codes (see [evidence](/core/evidence)).
4. **Compact** — when context pressure demands it, a durable checkpoint replaces history
   and the loop continues in a smaller context.

Every transition is recorded: run states (`preparing`, `inspecting`, `executing`,
`reviewing`, `compacting`, `completed`, `failed`, `cancelled`, `paused`), tool calls
with their effects, token ledgers and gate decisions.

## Why the split matters

- **Hosts stay replaceable.** The CLI, the VS Code extension and the web harness embed
  the same core; a behaviour fix (say, scope-aware validation staleness) lands once.
- **Effects are declared, not inferred.** A tool's effect profile says whether it can
  produce validation or diff-review evidence. A command that imitates
  `validate_project` does not: the evidence would be a model's word again.
- **Budgets are explicit.** Turns, tool calls, deadline, retries, no-progress episodes
  and completion rejections are configured numbers, not vibes — and the CLI exposes the
  ones a task legitimately needs raised.

## Honest limits

| Limit | Consequence |
| --- | --- |
| Single agent per run | Parallel work is expressed as [subagents](https://github.com/galaxy-blackhole/galaxy-code) or separate runs, not threads inside one |
| No crash-resume for the CLI | A checkpoint exists, but the production CLI does not resume a paused run yet; the flow harness resumes *steps*, which is what long runs needed |
| Approximate token accounting | The estimator self-calibrates against provider usage, so counts move between runs — see [context and caching](/core/context) |
| Provider-dependent caching | Caching behaviour is the provider's; the core's job is to keep the prefix stable |

Next: [evidence and the completion gate](/core/evidence).
