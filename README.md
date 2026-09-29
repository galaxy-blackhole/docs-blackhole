# docs-blackhole

Documentation site for **Galaxy Blackhole** — the `blackhole` CLI, the
`@galaxy-stack/ai-coder-core` runtime, the web GUI and the delivery journey.

Built with [VitePress](https://vitepress.dev) (same stack as
[`docs-orbit`](https://github.com/galaxy-orbit/docs-orbit) and
[`docs-nebula`](https://github.com/galaxy-nebula/docs-nebula)), deployed on Vercel.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in .vitepress/dist
npm run preview    # serve the built site
```

## Structure

| Path | Content |
| --- | --- |
| `index.md` | Landing page |
| `guide/` | Install, quickstart, configuration, TUI, flow harness, troubleshooting |
| `cli/` | Command reference, memory, skills, MCP, web |
| `web/` | Web GUI and the delivery journey |
| `core/` | Runtime architecture, evidence gate, context and caching, tools |
| `ecosystem/` | VS Code extension, retrieval core, version matrix |
| `reference/` | Release policy, failure journal, changelogs |
| `vi/` | Vietnamese locale for the entry pages |

Product versions documented here are pinned in
[`ecosystem/versions.md`](ecosystem/versions.md); the release rules live in
[`reference/release-policy.md`](reference/release-policy.md).
