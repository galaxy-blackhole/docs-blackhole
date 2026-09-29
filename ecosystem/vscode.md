# VS Code extension

**Galaxy Blackhole for VS Code** (`galaxy-code-vscode`, currently `2.0.0-prototype.0`)
is a host for the same runtime the CLI embeds: sidebar chat, workspace and command
adapters, approvals, storage — and nothing else. The agent loop, context assembly, tool
registry, checkpoints and the completion gate live in
[`@galaxy-stack/ai-coder-core`](/core/).

## Commands

| Command | Effect |
| --- | --- |
| `galaxy-code.openChat` | Open the chat surface |
| `galaxy-code.newThread` | Start a fresh thread |
| `galaxy-code.openWeb` | Open the web GUI instead |

A sidebar view (`galaxy-code-sidebar`) holds threads and the current run's state.

## What it inherits

Because it is a host, not a fork, everything the runtime guarantees applies in the
editor:

- the same **evidence rules** — a change is finished when validation and diff review say
  so, not when the model says so;
- the same **guards** — dependency-path protection, no-progress policy, argument
  clamping;
- the same **memory** — notes confirmed in the CLI are recalled in the editor, because
  they share the state directory.

## Status

Prototype: the marketplace identity is frozen (item ID `kevinbui.galaxy-code-vscode`,
display name *Galaxy Blackhole*) and the surface is usable, but treat it as a preview of
the host story rather than a finished product. The verified line for daily work is the
[CLI](/cli/).
