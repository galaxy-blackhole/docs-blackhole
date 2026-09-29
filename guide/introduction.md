# Introduction

Galaxy Blackhole is an AI coding system built around one uncomfortable question:
*when the agent says it is done, how do you know?*

Every other answer in this documentation follows from how we answer that one.

## The pieces

| Piece | What it is | Where it lives |
| --- | --- | --- |
| **`blackhole`** | CLI and terminal UI: one task, a chat session, a flow runner, skills, memory, MCP servers, the web GUI | `@galaxy-stack/blackhole-cli` |
| **ai-coder-core** | The runtime every host embeds: typed ports, tool effect profiles, context budgeting, checkpoints, the completion gate | `@galaxy-stack/ai-coder-core` |
| **Web GUI** | `blackhole web` boots a patched agent harness with the Galaxy brand, the PTC tool preset and the delivery journey panel | `galaxy-code/src/web` and `galaxy-code/web` |
| **VS Code extension** | The same runtime inside your editor | `galaxy-code-vscode` (prototype) |

## How it decides it is finished

An agent run cannot end on the model's word alone. Two things count as **completion
evidence**:

- **`validate_project`** — the declared checks of a project (test, typecheck, lint,
  build), run from the project root the model names.
- **`review_changes` / `git_operation diff`** — a review of the final diff.

A shell command is not evidence, a dev server is not evidence, and neither is a
paragraph of prose. When the model claims completion, the host evaluates the evidence
it actually has and answers with specific issue codes (see
[evidence and the completion gate](/core/evidence)). That is why the CLI can honestly
say *"validated: build, test — reviewed: diff"* at the end of a task.

## Design principles

**1. Evidence is produced by hosts, not asserted by models.**
Tool results carry an effect profile: only tools whose profile says `validate` or
`diff_review` can produce that evidence, and the gate reads effects, never summaries.

**2. Invalidation is scoped to what changed.**
A validation covers the paths it validated. Editing a README or a sibling package does
not void it; editing inside the validated scope does. Untracked workspace drift still
voids everything — deliberately.

**3. Context is a budget, not a hope.**
The runtime classifies context (mandatory, relevant, flexible), compacts with durable
checkpoints, and keeps the mutable run state at the *end* of the prompt so provider
prefix caching keeps working. The measurable result of that last decision: cache hit
went from 40% to 61% on the same flow.

**4. Long memory waits for consent.**
The agent can propose a convention; `blackhole memory confirm` (or the flow harness
standing in for you) makes it authoritative. Recall reports *drift* — in a live run the
agent answered with the five remembered conventions and flagged that the API layer had
not been wired to the database it remembered.

**5. Runs survive reality.**
Flow runs stream to disk, resume at a step, retry what a network outage or a host
deadline killed, and write their report even when they die.

## What this is not

- Not a hosted service: it runs on your machine, against a provider you choose.
- Not a chat wrapper: the interesting part is the runtime contract underneath.
- Not finished: the ecosystem page lists exactly what is stable, alpha or prototype —
  we would rather label it than pretend.

Next: [install and configure](/guide/getting-started).
