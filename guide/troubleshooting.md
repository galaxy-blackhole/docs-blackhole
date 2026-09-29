# Troubleshooting

Every entry below comes from a real run with its evidence. The full journal, including
the entries that turned out **not** to be product bugs, is in
[`reference/failure-journal`](/reference/failure-journal).

## A run never finishes and keeps polling a port

**Symptom** — the transcript shows `vite --port …`, `curl`, `lsof`, repeated
process checks, and the step reaches its deadline with no conclusion.

**Cause** — the agent decided the only proof of a UI is a running server. A skill
checklist used to say exactly that ("App boots: `bun run dev` shows no startup
errors"), and the model followed the trusted instruction.

**Fix** — the bundled skills now say the opposite, and `run_command` answers a
server-like command with an advisory. Prove a project with
`validate_project` (`build`, `test`, `lint`, `typecheck`); start a server only when
the task asks for a running app, and stop it before the final validation.

## `AI Coder reached maxTurns=N` or `run deadline exceeded`

**Cause** — the run budget, not the task. A step can reach the cap while its edits are
still landing (or after they are done — the gate was satisfied but there was no turn
left to say so).

**Fix** — raise it: `--max-turns 120 --run-minutes 45`. The runtime also grants one
tool-free finalization turn when the turn budget runs out, so a run whose evidence is
already complete can still report instead of failing.

## `Ollama transport failed [cause=ENOTFOUND]: fetch failed`

**Cause** — DNS or connectivity to the provider, not the workspace.

**Fix** — flow runs retry transport failures automatically (`--flow-step-retries`), and
`--flow-from <step-id>` resumes where it stopped without repeating finished steps. For
a single run, just re-run it: the session, workspace and memory are intact.

## The gate refuses completion: `WORKSPACE_EVIDENCE_STALE`, `WRITE_NOT_VALIDATED`

**Cause** — a file inside a validated scope changed after the validation, or a written
path has no later validation covering it.

**Fix** — run `validate_project` again for the project you just touched. What does *not*
require it: documentation writes (`.md`, `docs/`, LICENSE), and paths that were written
and then deleted (a scratch probe cannot be validated once it is gone). Untracked
drift — someone edited files outside the agent's view — voids every validation on
purpose.

## `DEPENDENCY_GUARD`: cannot read inside `node_modules`

**Cause** — the agent tried to read library source (a file tool, or a shell reader that
the advisory now names).

**Fix** — read a specific `package.json`, `README.md` or `*.d.ts` inside the package
(that is allowed and cheap), or use the framework's MCP knowledge and the bundled
skills: `orbit-framework` for Orbit, `galaxy-ui` for Galaxy UI.

## `Repeated tool call blocked by deterministic no-progress policy`

**Cause** — the same call with the same arguments, twice, with no state change; or
workspace content cycling back to an earlier hash.

**Fix** — change the approach: re-read the exact current region, use the full current
content for a whole-file write, or inspect a different source. The second no-progress
episode pauses the run and asks for direction instead of burning the budget.

## A secret appeared in a log or a diff

**Cause** — a credential was placed inside the workspace, where the agent's own diff
review will surface it, or pasted into a prompt.

**Fix** — keep credentials in `~/.galaxy/config.json` (0600) or your secret manager.
Log lines are redacted for common secret shapes before they hit disk, but redaction is
a safety net, not a policy.

## Where to look when you are stuck

| Place | What it tells you |
| --- | --- |
| `blackhole logs 20` | Newest runtime entries, including tool failures with stacks |
| `<state-dir>/logs/cli-<date>.ndjson` | The full trace: run transitions, model retries, MCP errors, gate decisions |
| `<state-dir>/runs/*/checkpoint.json` | The durable run state: evidence, validations, next action |
| `flow-report.json` + `progress.log` | For a flow: which step failed, and what it did in the minutes before |
