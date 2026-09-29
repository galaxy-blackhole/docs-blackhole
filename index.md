---
layout: home

hero:
  name: Galaxy Blackhole
  text: AI coding you can audit
  tagline: A CLI and TUI, a shared agent runtime, a web GUI and a delivery journey — every claim backed by evidence produced inside your workspace.
  image:
    src: /logo.svg
    alt: Galaxy Blackhole
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: CLI reference
      link: /cli/commands
    - theme: alt
      text: Delivery journey
      link: /web/journey

features:
  - title: Evidence, not vibes
    details: Only a project validation or a diff review produces completion evidence. The gate refuses to finish without it, and it is scope-aware so unrelated files cannot void your work.
  - title: Runs that survive
    details: Flow runs stream every event to disk, resume at a step, retry what an outage killed, and write their report even when they die.
  - title: Cheap context
    details: The mutable run state sits after the stable prefix, so a turn re-bills only its tail — measured 40% to 61% provider cache hit on the same flow.
  - title: Memory that waits for you
    details: The agent proposes conventions, you confirm them, and recall reports drift when the code no longer matches what it remembered.
---

## What ships

<div class="gb-cards">
  <div class="gb-card">
    <h3><a href="/cli/">blackhole CLI &amp; TUI</a></h3>
    <p>One task, an interactive terminal UI, a sequential flow runner, skills, memory, MCP servers and the web GUI — <span class="gb-pill">2.0.0</span></p>
  </div>
  <div class="gb-card">
    <h3><a href="/core/">ai-coder-core runtime</a></h3>
    <p>The engine behind every host: typed ports, tool effect profiles, context budgeting, checkpoints and the deterministic completion gate — <span class="gb-pill">0.3.0</span></p>
  </div>
  <div class="gb-card">
    <h3><a href="/web/">Web GUI &amp; journey</a></h3>
    <p><code>blackhole web</code> boots a patched harness with the Galaxy brand; the delivery journey drives dev → CI → UAT → approval → prod from one blueprint — <span class="gb-pill">alpha</span></p>
  </div>
  <div class="gb-card">
    <h3><a href="/ecosystem/versions">Ecosystem</a></h3>
    <p>VS Code extension, retrieval core and the version matrix that pins what this documentation was written against</p>
  </div>
</div>

## Install and run

```sh
npm i -g @galaxy-stack/blackhole-cli
blackhole chat                       # interactive TUI
blackhole run "add a health endpoint" # one task, one final result
blackhole flow flows/gymflow.json     # a documented sequence of prompts
```

The runtime is Node 22.13+ and ESM-only. Bring a model provider (Ollama or any
OpenAI-compatible endpoint) — see [install and configure](/guide/getting-started).

## How this documentation is verified

The [25-prompt end-to-end flow](/guide/flow-and-e2e) is the release gate: a run only
counts as verified when every step completes against the published packages. The
failures that shaped the current release, with their evidence and root causes, live in
the [failure journal](/reference/failure-journal).
