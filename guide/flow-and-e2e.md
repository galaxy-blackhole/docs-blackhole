# Flow runs and end-to-end verification

A **flow** is a JSON file listing prompts that must run in order, in one session and one
workspace. It exists because "the agent works" is a claim that needs a reproducible
test — and because a 25-step build is the cheapest way to find the failures a single
prompt never reaches.

## The file

```json
{
  "name": "gymflow",
  "promptPrefix": "[Galaxy E2E test harness] Headless environment: never ask the user to open a terminal.",
  "confirmCandidatesAfter": ["s03-memory", "s10-api-key"],
  "steps": [
    { "id": "s01-init", "prompt": "Create the GymFlow project …" },
    { "id": "s02-orbit-standards", "prompt": "Shape the backend like Orbit …", "expectTools": ["mcp_orbit"] },
    { "id": "s03-memory", "prompt": "Remember the project conventions …", "expectTools": ["memory_remember"] }
  ]
}
```

| Field | Meaning |
| --- | --- |
| `promptPrefix` | Prepended to every prompt — the headless contract lives here |
| `steps[].id` | Stable identifier; used by `--flow-from`, `--flow-until` and the report |
| `steps[].expectTools` | Tools the step must actually call. A step that passes without them is *not* a pass |
| `confirmCandidatesAfter` | Step ids after which the harness confirms proposed memories, standing in for the user |

## Run it

```sh
blackhole flow flows/gymflow.json --workspace /tmp/e2e/workspace --state-dir /tmp/e2e/state --flow-out /tmp/e2e/out
```

Every step writes:

| File | Content |
| --- | --- |
| `step-NN-<id>.ndjson` | Every event, appended **as it happens** |
| `progress.log` | One bounded, secret-free line per tool call, result, gate rejection, state change and retry |
| `flow-report.json` | The final verdict: per-step state, expectations, gate rejections, tool failures, tokens and cumulative cache hit rate |

The report is written **even when the run dies** and carries `fatal`, `resumedFrom`,
`stoppedAfter`, `skippedSteps` and `retriedSteps` — a crash can never read as a pass,
and a resumed run never claims the steps it skipped.

## Surviving reality

| Flag | Use |
| --- | --- |
| `--flow-from <step-id>` | Resume at a step in the same session, workspace and state |
| `--flow-until <step-id>` | Stop after a step; pair with `--flow-from` to re-run a range |
| `--flow-step-retries <n>` | Retry a step that hit a **transport outage** or the **host deadline** before calling it failed |
| `--max-turns`, `--run-minutes` | Give a heavy step more room than the defaults |

Both kinds of retry are infrastructure, not task failures: a DNS outage once killed a
three-hour run at step 6, and a security step reached the 45-minute deadline at turn 73
with its edits still landing. The retry continues in the same session with a fresh
budget, and the number of attempts stays bounded.

## Auditing a run

```sh
node scripts/e2e-report.mjs /tmp/e2e/out
```

The script prints a per-step table and flags what a *passing* step can still hide:

- a step that never called the tool its definition expects,
- component-library files written with no scaffold call,
- a whole-project check run through the shell (no evidence),
- a long-running server started in a headless run,
- evidence ordered after the last write,
- the same call emitted twice inside one turn.

That check exists because the expensive failures are not crashes — they are steps that
finish while doing the wrong thing.

## The release gate

The 25-prompt [GymFlow flow](https://github.com/galaxy-blackhole/galaxy-code/blob/main/flows/gymflow.json)
builds an Orbit backend and a React/Vite/Galaxy UI frontend, then exercises memory,
security, dashboards, exports and a final summary. A published `x.y.z` ships only after
this flow completes against it.

The failures it found — and the fixes — are journalled in the
[failure journal](/reference/failure-journal), including the ones that were *not*
product bugs (an external cancel, a DNS outage) so nobody re-investigates them.

Next: [troubleshooting](/guide/troubleshooting).
