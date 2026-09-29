# CLI overview

`blackhole` is one binary with a small, explicit surface.

| Command | Purpose |
| --- | --- |
| `blackhole chat` | Interactive terminal UI (default when no command is given) |
| `blackhole run "task"` | One task, one final result (`--json` for machine output) |
| `blackhole flow <file.json>` | Sequential prompts in one session, logged per step |
| `blackhole web [options]` | Galaxy Blackhole web GUI (and its `doctor`/`config` checks) |
| `blackhole skills …` | Discover, install, update and remove skills |
| `blackhole mcp …` | Connect MCP servers, list tools, manage OAuth logins |
| `blackhole memory …` | Workspace memory: search, list, confirm, history, forget, consolidate |
| `blackhole sessions` | List conversation sessions |
| `blackhole logs [n]` | Newest runtime log entries |
| `blackhole help`, `--version` | Usage and version |

## Global flags

```text
--workspace <dir>            workspace root (default: current directory)
--state-dir <dir>            sessions, memory, checkpoints, logs (default ~/.galaxy/agent)
--session <id>               resume a conversation session
--model <id> --base-url <url>  provider override for this run
--config <path>              provider config (default ~/.galaxy/config.json)
--agent-config <json>        agent configuration document
--profile coding|assistant|research
--approval full|balanced
--allow-tool <canonical-id>  pre-approve a tool (repeatable)
--thinking auto|default|off|on|minimal|low|medium|high|xhigh|max
--embedding-model <id> --embedding-base-url <url>
--skills-index <path-or-url> --skills-dir <dir> --skills-public-key <pem>
--system-prompt-in-history | --no-system-prompt-in-history
--research                   enable provider web search/fetch
--no-galaxy-mcp              skip the bundled orbit/nebula MCP servers
--json                       run/flow: one machine-readable result
--max-turns <n> --run-minutes <n>
--flow-from <step-id> --flow-until <step-id> --flow-step-retries <n>
```

Full descriptions: [commands and flags](/cli/commands) and the
[configuration reference](/guide/configuration).

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | The run completed and its evidence satisfied the completion gate |
| `1` | The run failed, or a flow did not pass its expectations |
| `130` | The run was cancelled (`Esc`, `SIGINT`) |

A cancelled run is not a failed run: the session, memory and workspace stay usable, and
a flow can be resumed with `--flow-from`.

## Everything is logged

```sh
blackhole logs 20
tail -f ~/.galaxy/agent/logs/cli-$(date +%F).ndjson
```

Each entry is one JSON line: command lifecycle, run state transitions, tool failures
with stacks, model retries, MCP connect errors, OAuth events and crashes. Secrets are
redacted before the line is written.

Next: [commands and flags](/cli/commands).
