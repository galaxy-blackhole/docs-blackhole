# Version matrix

What this documentation was written against, and how each piece is labelled.

| Piece | Version | Status |
| --- | --- | --- |
| `@galaxy-stack/blackhole-cli` | **2.0.0** | Stable — verified by the 25-prompt flow |
| `@galaxy-stack/ai-coder-core` | **0.3.0** | Stable — verified by the same flow |
| Web GUI (`blackhole web`) | follows the CLI | Alpha — overlay pinned to a specific harness release |
| `@galaxy-stack/blackhole-gbh` | 0.1.0-alpha.1 | **Frozen** — merged into `galaxy-code` as `blackhole web`; kept as a read-only reference |
| `galaxy-code-vscode` | 2.0.0-prototype.0 | Prototype — VS Code host for the same runtime |
| `@galaxy/retrieval-core` | 0.1.0 | Early — retrieval contracts and planning |
| `docs-blackhole` (this site) | 1.0.0 | Current |

## What "stable" means here

A plain `x.y.z` is published **only after the end-to-end flow completes against it**.
That gate is not aspirational: the release notes for 2.0.0 and 0.3.0 list the failures
the flow found while the versions were being prepared, and the
[failure journal](/reference/failure-journal) keeps the evidence.

Work in progress keeps an explicit `-alpha.N` suffix and publishes under the `alpha`
dist-tag, so `npm install …@latest` never lands on unverified work.

## Version pins that matter

| Pin | Where | Why |
| --- | --- | --- |
| Harness release for the web overlay | `galaxy-code/web/patches/gbh-web.patch.yml` | Patches are verified against one release; moving it requires re-verification |
| `@galaxy-stack/ai-coder-core` in the CLI | `galaxy-code/package.json` | The CLI publishes with a registry pin, never a `file:` dependency |
| Node ≥ 22.13 | both packages | The runtime uses the built-in SQLite for memory and sessions |

## Compatibility notes

- **Node 22.13+** is required, not recommended.
- **ESM only.** The core has no CommonJS entry point.
- **The web GUI follows the CLI version** but its overlay targets a pinned harness
  release; `blackhole web doctor` reports both, which is the quickest way to see a
  mismatch.
- **The VS Code extension is a host**, not a fork: it embeds the same core, so runtime
  fixes apply to it as soon as it pins the new core version.
