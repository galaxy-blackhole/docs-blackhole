# Web GUI

`blackhole web` gives you the same agent runtime in a browser, with the Galaxy brand and
one deliberate simplification: **PTC is the only agent preset**.

## What PTC means

Instead of exposing a dozen tools to the model, the preset exposes **one**: `run_code`.
The model writes a short program against a generated SDK, and that program calls the
real tools — `bash`, `read`, `edit`, `write`, `grep`, `subagent`, `todo_write`,
`journey_get`, `journey_set`, `journey_run`.

Two consequences worth knowing:

- **The tool surface stays small.** A long list of schemas is context the model pays for
  on every turn; one tool plus documentation is cheaper and, in practice, steadier.
- **Evidence rules still apply.** The Galaxy patches keep the runtime's completion gate
  and validation semantics, so a run in the browser is judged the same way as a run in
  the terminal.

## Boot it

```sh
blackhole web
blackhole web doctor --json     # runtime version, patches applied, Galaxy key present
blackhole web config            # where the harness, profiles and caches live
```

The GUI uses an isolated harness home (override with `--home`), so it never mixes
profiles or credentials with another harness installation.

## What the overlay contains

| Layer | Files | Purpose |
| --- | --- | --- |
| Patches | `web/patches/gbh-web.patch.yml`, `gbh-ui.patch.yml`, `gbh-brand.patch.yml` | Model route, PTC preset, hidden management surfaces, sidebar brand |
| Brand | `web/brand/` | Client plugin, logo, favicon, Vietnamese locale |
| Journey | `web/brand/lib/journey-*.js`, `web/brand/panel/journey-panel.js` | The delivery journey panel (see [delivery journey](/web/journey)) |

Patches are version-pinned and verified against a specific harness release; when that
release moves, the overlay is re-verified rather than silently re-applied.
`blackhole web doctor` is the check that tells you which case you are in.

## Sessions and memory

The GUI shares the CLI's state directory, so sessions you started with `blackhole chat`
appear in the sidebar, memory written in the browser is recalled in the terminal, and a
provider key configured once works in both.

## Status

The web GUI is **alpha**: the overlay is maintained against a pinned harness release and
its surfaces are still moving. The CLI and runtime are the verified line; the GUI
carries the `alpha` dist-tag policy described in the
[release policy](/reference/release-policy).
