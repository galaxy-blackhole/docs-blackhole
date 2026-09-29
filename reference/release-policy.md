# Release policy

## Two lines, one rule

| Line | Version shape | Dist-tag | Ships when |
| --- | --- | --- | --- |
| **Verified** | `x.y.z` | `latest` | The end-to-end flow completes against it |
| **Development** | `x.y.z-alpha.N` | `alpha` | Whenever it is ready to be tried |

`npm install @galaxy-stack/blackhole-cli` therefore always lands on a verified line;
`@alpha` is where work in progress lives. Publishing is automated through npm trusted
publishing (OIDC, no stored token) on a push to `main`, and the workflow skips a version
that npm already has.

## What "verified" claims

For `2.0.0` and `0.3.0` it means:

- the [25-prompt flow](/guide/flow-and-e2e) completed every step against the published
  packages — Orbit backend, React/Vite/Galaxy UI frontend, memory, security, dashboards,
  exports, summary;
- the failures that surfaced on the way were diagnosed, fixed, and are listed in the
  [failure journal](/reference/failure-journal);
- the installed artifact was exercised (`npm i -g`, then a real run), not just the local
  build.

It does **not** claim the products are feature-complete; the
[version matrix](/ecosystem/versions) labels what is stable, alpha, prototype or frozen.

## `1.0.0` and API stability

The core's `1.0.0` is reserved for the API-stability milestone. `0.y.z` releases may
still change shape — that is what the leading zero says.

## Changelogs

Both packages keep a `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com)
form, in English, with times in `+07:00`. The core additionally files a fragment per
fix in `CHANGELOG.d/` as the work lands, and compiles the outstanding fragments into a
version section at release time.

The fragments stay in the repository after compilation so the links inside the compiled
section keep resolving. See [changelogs](/reference/changelogs).

## How a change gets in

1. A fix lands with a regression test (or an explicit note saying why one is impossible).
2. If it came from a real failure, it is written up in
   `galaxy-code/docs/TEST_FAILURE_ANALYSIS.md` — symptom, evidence, root cause, fix,
   status.
3. The end-to-end flow is re-run; a step that regressed shows up as a failing step, not
   as a bug report from a user.
4. A version is cut: changelog compiled, version bumped, pushed — and CI publishes.

## Reading a version number

`2.0.0` (CLI) and `0.3.0` (core) are a pair: the CLI pins the core version it was
verified against, and the published manifest carries the registry pin rather than a local
path. If you need to know exactly what a given CLI build embeds, read its
`package.json` — that is the contract.
