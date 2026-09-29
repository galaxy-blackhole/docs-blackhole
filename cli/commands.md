# Commands and flags

## `blackhole chat`

Interactive TUI. See the [terminal UI tour](/guide/tui).

## `blackhole run "task"`

One task, one final result. The runtime inspects, edits, validates and reviews, then
answers with the evidence it produced.

```sh
blackhole run "add a GET /health endpoint and a test for it"
blackhole run "…" --json | jq '.state, .validation'
blackhole run "…" --max-turns 80 --run-minutes 30
blackhole run "…" --allow-tool workspace.write --allow-tool project.validate
```

`--json` prints one result object: `state`, `content`, `validation`, `writes`,
`checkpoint`, `error`. It is the intended interface for scripts and CI.

## `blackhole flow <file.json>`

Sequential prompts in one session and workspace, with per-step logs, expectations and a
final report. See [flow runs and E2E verification](/guide/flow-and-e2e).

```sh
blackhole flow flows/gymflow.json --workspace /tmp/e2e/ws --state-dir /tmp/e2e/state --flow-out /tmp/e2e/out
blackhole flow flows/gymflow.json --flow-from s09-security --flow-until s10-api-key --run-minutes 90
```

| Flag | Effect |
| --- | --- |
| `--flow-out <dir>` | Where `step-*.ndjson`, `progress.log` and `flow-report.json` go |
| `--flow-from <step-id>` | Start at this step (earlier steps are recorded as skipped) |
| `--flow-until <step-id>` | Stop after this step |
| `--flow-step-retries <n>` | Retry a step killed by a transport outage or the host deadline (default 1) |
| `--flow-stop-on-error` | Stop at the first step that fails or misses an expectation |

## `blackhole web [options]`

| Command / flag | Effect |
| --- | --- |
| `blackhole web` | Boot the GUI (default port `3090`, opens a browser) |
| `blackhole web doctor [--json]` | Check the harness runtime, bundled patches and the Galaxy key |
| `blackhole web config` | Print resolved paths |
| `--port <n>` `--host <h>` | Bind address |
| `--profile <name>` `--home <dir>` | Harness profile and home (default isolated) |
| `--model <id>` `--preset <name>` | Default model and agent preset (`ptc`) |
| `--patch <file>` | Extra overlay patch (repeatable) |
| `--no-brand` `--no-open` `--dry-run` `--json` | Brand overlay off, no browser, resolve only, machine output |

Details: [web GUI](/cli/web).

## `blackhole memory …`

| Command | Effect |
| --- | --- |
| `memory search <query>` | Recall confirmed notes (candidates only with `--include-candidates`) |
| `memory list` | List notes, including candidates |
| `memory remember <key> <text>` | Store a **user-confirmed** note |
| `memory confirm <key>` | Promote the current candidate revision to confirmed |
| `memory history <key>` | Revisions and provenance |
| `memory forget <key>` | Delete every revision of a key |
| `memory consolidate` | Prune superseded revisions and orphan vectors |
| `memory import-quasar <path>` | Import a Galaxy desktop (Quasar) memory database |

Details: [memory](/cli/memory).

## `blackhole skills …`

| Command | Effect |
| --- | --- |
| `skills`, `skills show <id>` | List installed skills, or inspect one |
| `skills search <query>` | Search the configured index |
| `skills install <id>` [`--skill-version <range>`] | Install from the marketplace |
| `skills update` | Update installed skills to the newest satisfying version |
| `skills remove <id>` | Uninstall |

Details: [skills](/cli/skills).

## `blackhole mcp …`

| Command | Effect |
| --- | --- |
| `mcp` | Connect configured servers and list their tools |
| `mcp login <server>` | Browser OAuth for a server declared with `"auth": "oauth"` |
| `mcp logout <server>` | Forget stored tokens |

Details: [MCP servers](/cli/mcp).

## `blackhole sessions` and `blackhole logs [n]`

`sessions` lists conversation sessions with their ids (use them with `--session`);
`logs` prints the newest runtime log entries, which is the first thing to capture for a
bug report.
