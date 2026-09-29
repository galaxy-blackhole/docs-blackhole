# Install and configure

## Requirements

- **Node.js 22.13 or newer** (the runtime uses the built-in SQLite for memory and the
  session store).
- A model provider: **Ollama** (`https://ollama.com` by default, cloud or local) or any
  **OpenAI-compatible** endpoint.

## Install

```sh
npm i -g @galaxy-stack/blackhole-cli
blackhole --version
```

The published line is the verified one: a plain `2.0.0` ships only after the
[end-to-end flow](/guide/flow-and-e2e) completes against it, while work in progress
publishes under the `alpha` dist-tag. See the
[release policy](/reference/release-policy).

## Point it at a model

The CLI reads a provider entry from `~/.galaxy/config.json` (override with
`--config <path>`):

```json
{
  "agent": [
    {
      "type": "manual",
      "apiKey": "…",
      "baseUrl": "https://ollama.com",
      "model": "deepseek-v4.1-flash:cloud",
      "reasoningEfforts": ["low", "medium", "high"]
    }
  ]
}
```

- `baseUrl` defaults to `https://ollama.com`; `model` defaults to
  `deepseek-v4.1-flash:cloud`.
- `reasoningEfforts` is optional and only declares which thinking levels the model
  accepts — the CLI never sends an unsupported level.
- Anything not set here can be passed per run: `--model`, `--base-url`,
  `--agent-config <json>`.

Provider credentials can also come from the environment for CI use; the CLI reports the
provider it resolved in `/session` and in the startup header.

## Your first run

```sh
blackhole chat                                  # interactive TUI in this directory
blackhole run "add a GET /health endpoint"      # one task, one final result
blackhole run "…" --json                        # machine-readable result
```

Useful defaults to know:

| Flag | Why you would use it |
| --- | --- |
| `--workspace <dir>` | Point at a repository without `cd`-ing into it |
| `--state-dir <dir>` | Keep sessions, memory and logs outside the workspace (default `~/.galaxy/agent`) |
| `--profile coding\|assistant\|research` | Change the agent's operating assumptions |
| `--max-turns <n>` / `--run-minutes <n>` | Give a genuinely large task more room than the 48-turn / 15-minute defaults |
| `--approval full\|balanced` | `full` never asks; `balanced` asks before risky tools |

## Where state lives

| Path | Content |
| --- | --- |
| `~/.galaxy/config.json` | Provider entries (`--config`) |
| `~/.galaxy/agent.json` | Agent configuration (`--agent-config`) |
| `~/.galaxy/agent/` | Default state dir: sessions, memory database, checkpoints, `logs/cli-<date>.ndjson` |
| `<workspace>/.galaxy/workspace.json` | The agent's own note about derived directories (build output it should not treat as authored changes) |

`--state-dir` must point **outside** the workspace: state inside a repository would
pollute the diff it is supposed to audit.

## Verify the install

```sh
blackhole --version              # e.g. 2.0.0
blackhole memory list            # empty on a fresh state dir, not an error
blackhole logs 5                 # the newest runtime log entries
```

Every command writes JSON lines to `<state-dir>/logs/cli-<date>.ndjson` (mode 0600,
rotated), with secrets redacted before they hit disk — so a failure can still be traced
after the terminal is gone.

Next: [configuration reference](/guide/configuration) or the
[terminal UI tour](/guide/tui).
