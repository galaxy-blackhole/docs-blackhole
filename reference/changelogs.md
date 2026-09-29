# Changelogs

Both published packages keep a changelog in [Keep a Changelog](https://keepachangelog.com)
form, in English, with times recorded in `+07:00`.

| Package | Changelog | Notes |
| --- | --- | --- |
| `@galaxy-stack/blackhole-cli` | [galaxy-code/CHANGELOG.md](https://github.com/galaxy-blackhole/galaxy-code/blob/main/CHANGELOG.md) | One entry per release |
| `@galaxy-stack/ai-coder-core` | [galaxy-ai-coder-core/CHANGELOG.md](https://github.com/galaxy-blackhole/galaxy-ai-coder-core/blob/main/CHANGELOG.md) | Compiled from per-fix fragments at release time |

## The fragment convention

The core files every behaviour- or API-level fix as a dated fragment in
`CHANGELOG.d/` **as the work lands**, not at release time:

```text
CHANGELOG.d/2026-09-28-thu-tu-mandatory-state-cache.md
```

Each fragment records the area, the behaviour before and after, and the regression test —
and links the incident in `galaxy-code/docs/TEST_FAILURE_ANALYSIS.md` when the fix came
from a live failure. At release time the outstanding fragments are compiled into a
version section; the compiled section links each fragment, so the fragments stay in the
repository rather than being deleted.

## Reading a release

- `[2.0.0]` and `[0.3.0]` are the verified pair documented on this site.
- Anything with `-alpha.N` is development: it exists so a fix can be tested, and it
  publishes under the `alpha` dist-tag.
- The per-fix trail in the core's `[0.3.0]` section is the fastest way to see how many
  of today's behaviours came from real failures rather than design meetings.

## Comparing a version against a run

Runtime logs record the `packageVersion` in play. When you suspect a fixed defect has
recurred, compare that version against the changelog **before** investigating — several
"regressions" during development turned out to be a run on an older build.
