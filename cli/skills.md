# Skills

A **skill** is a document the agent treats as trusted instructions for a specific
domain. Galaxy Blackhole ships two, and can install more from a signed marketplace.

## Bundled skills

| Skill | Covers |
| --- | --- |
| `orbit-framework` | Orbit (Bun, NestJS-style): modules, controllers, services, Zod validation, GraphQL, testing, route prefixing and versioning |
| `galaxy-ui` | Galaxy UI (Nebula): component catalogue, the `nebula` CLI, Tailwind and design tokens |

They ship inside the CLI package and are **auto-activated when the task clearly needs
them** — a prompt about an Orbit backend loads `orbit-framework`, a prompt about UI
components loads `galaxy-ui`. The transcript shows the activation.

## Search order

Skills are resolved from four places, nearest-wins:

| Layer | Location |
| --- | --- |
| Bundled | Inside the installed CLI package |
| Managed | `--skills-dir <dir>`, or `<state-dir>/skills` for marketplace installs |
| User | `~/.agents/skills` |
| Workspace | `<workspace>/.agents/skills` |

That last layer is how a repository carries its own conventions: commit a skill under
`.agents/skills` and every run in that repository reads it.

## Commands

```sh
blackhole skills                       # installed skills
blackhole skills show galaxy-ui        # one skill's content
blackhole skills search "table"        # search the configured index
blackhole skills install acme/deploy --skill-version "^1.2.0"
blackhole skills update
blackhole skills remove acme/deploy
```

## Marketplace and signatures

```sh
blackhole skills install acme/deploy \
  --skills-index https://skills.example.com/index.json \
  --skills-public-key ~/.galaxy/skills-index.pem
```

- The index is a URL or a local path; installs land in the managed layer.
- With a public key, the index signature is verified before anything is installed, and
  `--skill-version` accepts a semver range so an update cannot silently jump a major
  version.
- Marketplace installs never overwrite the bundled skills.

## Why skills matter more than they look

Skills are the difference between an agent that guesses an API and one that follows it.
Two examples from the project's own failure journal:

- A checklist line — *"App boots: `bun run dev` shows no startup errors"* — made the
  agent start dev servers, poll ports and leave probe files behind until a step hit its
  deadline. Fixing the **skill** changed the behaviour; a warning in the system prompt
  had not.
- A skill that documents *"there is no `app.setGlobalPrefix` in Orbit; the prefix goes
  on `@Controller`"* stopped the agent hunting for a NestJS API that does not exist.

If you maintain a framework, write the skill before you write the prompt engineering.
