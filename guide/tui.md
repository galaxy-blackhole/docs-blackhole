# Terminal UI

`blackhole` with no arguments opens the interactive UI. The interface language is
Vietnamese; the mechanics are below.

## Keys

| Key | Action |
| --- | --- |
| `Enter` | Send the prompt |
| `Esc` | Stop the current run (the run ends as *cancelled*, not *failed*) |
| `Ctrl+C` | Exit the CLI |
| `Ctrl+P` | Pick the model for the next turn |
| `Ctrl+T` | Cycle the thinking effort |
| `Ctrl+L` | Show or hide thinking text in the transcript |
| `Ctrl+O` | Expand or collapse tool-call detail |
| `Ctrl+S` | Open skills and the marketplace |
| `Ctrl+G` | Jump to the bottom of the transcript |
| `PgUp` / `PgDn` | Scroll the transcript |
| `y` / `n` | Answer a tool-permission prompt (with `--approval balanced`) |

## Slash commands

Type `/` in the composer for the menu:

| Command | Purpose |
| --- | --- |
| `/help` | Shortcuts and the command list |
| `/model` | Choose the model for the next turn |
| `/effort` | Choose the reasoning level |
| `/thinking` | Toggle thinking text in the transcript |
| `/tools` | Toggle tool-call detail |
| `/skills` | Skills and marketplace |
| `/diff` | Full-screen view of the most recent diff (`↑`/`↓`, `PgUp`/`PgDn` to scroll, `Esc` to close) |
| `/session` | Session, workspace, provider and log paths |
| `/clear` | Clear the transcript (session history is kept on disk) |
| `/quit` | Exit |

## Reading the transcript

- Each row is prefixed by its role: your prompt, the assistant, a tool call, a tool
  result, a completion-gate rejection, or a state transition.
- Three or more consecutive tool calls collapse into one summary line —
  `⚙ N tool calls · ✔ …` — and `Ctrl+O` expands them.
- Diffs are rendered with colour (additions and removals) up to a bounded number of
  lines; `/diff` shows the whole patch.
- While a turn streams, a caret marks the live text; when it ends, the turn footer
  shows the provider brand, model, effort, tokens and duration.
- Gate rejections appear inline with their issue codes, so a refused completion is
  visible in the transcript rather than hidden in a log.

## Composer

- The native terminal caret is positioned so IME preedit (Vietnamese input) appears
  inside the input.
- Long prompts wrap instead of scrolling the header away; the help panel is sized to
  the viewport so its title is never clipped.
- A workspace file index completes paths, so you can reference a file without leaving
  the composer.

## Logging while you work

The TUI writes the same JSON-lines log as every other command — run transitions, tool
failures with stacks, model retries, MCP errors — to
`<state-dir>/logs/cli-<date>.ndjson`. `blackhole logs [n]` prints the newest entries,
which is what to copy into a bug report.

Next: [flow runs and end-to-end verification](/guide/flow-and-e2e).
