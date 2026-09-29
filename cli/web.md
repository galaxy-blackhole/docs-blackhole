# `blackhole web`

`blackhole web` boots the Galaxy Blackhole web GUI: a patched agent harness with the
Galaxy brand, a single `ptc` agent preset, an isolated home, and the delivery journey
panel.

```sh
blackhole web                       # default: http://127.0.0.1:3090, opens a browser
blackhole web --port 3200 --no-open
blackhole web doctor                # check the harness runtime, patches and the Galaxy key
blackhole web config                # print resolved paths
blackhole web --dry-run --json      # resolve everything, boot nothing
```

| Flag | Effect |
| --- | --- |
| `--port <n>` / `--host <h>` | Bind address (default `3090`, loopback) |
| `--profile <name>` | Harness profile to boot |
| `--home <dir>` | Isolated harness home (default under `~/.galaxy`) |
| `--model <id>` | Default model for the GUI |
| `--preset <name>` | Agent preset (`ptc`) |
| `--patch <file>` | Extra overlay patch, repeatable |
| `--no-brand` | Boot without the Galaxy brand overlay |
| `--open` / `--no-open` | Whether to open a browser |
| `--dry-run` / `--json` | Resolve and report without booting |

## What the Galaxy overlay changes

The GUI is a stock agent-harness web surface plus three overlay patches shipped inside
the CLI package:

| Patch | Purpose |
| --- | --- |
| `gbh-web` | Base overlay: the PTC tool preset, the Galaxy model route, the harness version pins |
| `gbh-ui` | Simplifications: the preset picker and plugin-management surfaces are hidden, because PTC is the only preset and the tool plugins stay mounted regardless |
| `gbh-brand` | Replaces the stock sidebar brand with Galaxy Blackhole (mark and name) |

The patches are verified against a pinned harness release; `blackhole web doctor`
reports the version it found, the patches it applied and whether a Galaxy key is
available — the fastest way to tell a broken environment from a broken build.

## Branding and localisation

- `web/brand/` holds the brand bundle: a client plugin, a logo and favicon, and the
  Vietnamese locale file used by the GUI.
- Context producers from the harness are relabelled to *System prompt* so the transcript
  reads the way the CLI's own timeline does.

## Where it keeps state

| Path | Content |
| --- | --- |
| `~/.galaxy/<harness-home>/` | Harness profiles, caches, sessions (isolated from the global harness home) |
| `<state-dir>/logs/cli-<date>.ndjson` | Boot, patch and credential decisions |
| `<state-dir>/mcp-auth.json` | MCP OAuth tokens (0600) |

The GUI shares the CLI's provider credentials, so a key configured for the terminal UI
works in the browser without a second setup step.

Next: the [web GUI overview](/web/) and the
[delivery journey](/web/journey).
