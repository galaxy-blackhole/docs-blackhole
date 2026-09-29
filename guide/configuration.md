# Configuration reference

## Flags

| Flag | Meaning |
| --- | --- |
| `--version`, `-v` | Print the CLI version |
| `--workspace <dir>` | Workspace root (default: current directory) |
| `--state-dir <dir>` | Sessions, memory, checkpoints and logs; must be outside the workspace (default `~/.galaxy/agent`) |
| `--session <id>` | Resume a conversation session by id |
| `--model <id>`, `--base-url <url>` | Override the provider entry for this run |
| `--config <path>` | Provider config file (default `~/.galaxy/config.json`, first `manual` entry) |
| `--agent-config <json>` | Agent configuration document (default `~/.galaxy/agent.json`) |
| `--profile coding\|assistant\|research` | Agent profile; `coding` requires workspace inspection before completion |
| `--thinking <level>` | `auto\|default\|off\|on\|minimal\|low\|medium\|high\|xhigh\|max`; availability depends on the model, and `auto`/`default` sends no thinking field |
| `--allow-tool <canonical-id>` | Pre-approve a tool for non-interactive runs; repeatable |
| `--approval full\|balanced` | `full` (default) never prompts; `balanced` asks before risky effects |
| `--embedding-model <id>`, `--embedding-base-url <url>` | Enable semantic memory (for example `bge-m3`) |
| `--skills-index <path-or-url>`, `--skills-dir <dir>`, `--skills-public-key <pem>`, `--skill-version <range>` | Skill marketplace and signature verification |
| `--no-galaxy-mcp` | Skip the bundled `orbit` and `nebula` MCP servers |
| `--system-prompt-in-history` / `--no-system-prompt-in-history` | Force the system-prompt update strategy; by default the CLI follows the verified-model list |
| `--research` | Enable provider web search/fetch (`search_web` is discovered lazily through `search_tools`) |
| `--json` | `run`/`flow`: one machine-readable result instead of the TUI |
| `--max-turns <n>`, `--run-minutes <n>` | Model turns (default 48) and host deadline (default 15) for one run |
| `--flow-from <step-id>`, `--flow-until <step-id>` | Resume a flow, or bound it to a range |
| `--flow-step-retries <n>` | Extra attempts when a step dies on a transport outage or the host deadline |

## Profiles

| Profile | Behaviour |
| --- | --- |
| `coding` (default) | Assumes a repository: inspection is required before completion, and the diff review is expected |
| `assistant` | Conversation-first; no inspection requirement |
| `research` | Research-oriented prompts with citation expectations |

## Thinking levels

Thinking is negotiated, not asserted: the CLI asks the provider what the model
supports and only offers levels it can honour. `auto` and `default` send no thinking
field at all, which is the safest choice for a new model. In the TUI, `Ctrl+T` cycles
the effort and `/effort` opens the picker.

## Approvals

`--approval full` is the default because the CLI is usually driven by someone watching
the transcript. For non-interactive runs (CI, scripts) keep `full` **or** pre-approve
the exact tools you expect with `--allow-tool`; the runtime refuses to guess when it
cannot ask, and reports the tool it paused on.

## Environment

| Variable | Effect |
| --- | --- |
| `PORT`, `CORS_ORIGIN` | Belong to *your* project, not the CLI — but the E2E flow's generated apps use them, so they appear in flow logs |
| `GBH_*`, `GALAXY_*` | Read by the `gbh` launcher and the web GUI (see [web GUI](/web/)) |
| `DSH_HOME` | Where the harness used by `blackhole web` keeps its profiles and caches |

Provider keys belong in `~/.galaxy/config.json` (mode 0600) or your secret manager —
never in a workspace file, where the diff review would expose them.

Next: [terminal UI](/guide/tui).
