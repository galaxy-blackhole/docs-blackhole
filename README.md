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
| `vi/` | Vietnamese mirror of **every** page, same paths as the English tree |

Both locales are complete and kept 1:1: each English page has a Vietnamese counterpart with
the same headings, tables and code blocks, and the locale switcher in the navigation moves
between them. Pages carry `hreflang` alternates (en, vi, x-default) so search engines pair
them.

## Checks

`npm run build` is the site's only test, and CI runs it on every push and pull request
([`.github/workflows/build.yml`](.github/workflows/build.yml)): a dead internal link or
markdown Vue cannot parse fails there instead of in production.

When editing, two things bite often enough to be worth stating:

- A bare placeholder such as `<step-id>` **outside backticks** breaks the build with
  *"Element is missing end tag"*. Keep placeholders in inline code (`--flow-from <step-id>`).
- A link to a page that does not exist yet fails the build. Translate a page and link it in
  the same change, or point at the English path until the Vietnamese page lands.

Product versions documented here are pinned in
[`ecosystem/versions.md`](ecosystem/versions.md); the release rules live in
[`reference/release-policy.md`](reference/release-policy.md).
