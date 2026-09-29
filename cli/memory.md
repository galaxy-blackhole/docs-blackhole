# Memory

Memory is how the agent keeps your conventions across sessions without pretending it
remembers things you never approved.

## The model

| Concept | Meaning |
| --- | --- |
| **Key** | A stable identifier, often dotted: `gymflow.database`, `acme.api.prefix` |
| **Scope** | `workspace:<sha256>` — a note written in one repository is invisible in another |
| **Trust** | `candidate` (the agent proposed it) or `confirmed` (a human, or the flow harness acting for one, approved it) |
| **Revision** | Every confirm bumps the revision; old revisions stay as `superseded` history |
| **Status** | `active` while it applies; `superseded` once a newer revision exists |

Only **confirmed + active** notes are recalled as authoritative. Candidates are visible
with `blackhole memory list`, so you can see what the agent wants to remember before it
becomes a fact.

## Day to day

```sh
blackhole memory remember gymflow.database "SQLite file gymflow.db, accessed with bun:sqlite"
blackhole memory list
blackhole memory search "database port"
blackhole memory history gymflow.database
blackhole memory forget gymflow.database
```

In the TUI the agent proposes notes on its own; `blackhole memory confirm <key>` (or the
flow harness, for unattended runs) turns them into memory.

## Recall inside a run

Recall is a tool call, not a hidden prompt prefix. The agent sends
`memory_search("gymflow conventions port database api prefix …")` and gets back the
confirmed records with their scope and revision. In a live run the agent:

1. searched for the conventions it had been told;
2. answered with all five (ports, database, API prefix, API key, frontend);
3. **flagged a drift** — the API layer still used in-memory maps instead of the
   database it remembered — and later fixed it.

That combination (recall, verify against the workspace, report the mismatch) is the
point of the feature: memory that is checked, not trusted.

## How recall works

- **Default: lexical (FTS5).** Fast, exact and offline; a synonym the note does not
  contain will not match.
- **Optional: semantic.** Pass `--embedding-model <id> --embedding-base-url <url>`
  (for example `bge-m3`) and recall runs over embeddings as well, which is what makes
  `"cổng"` match `"port"`.
- `blackhole memory consolidate` prunes superseded revisions and orphaned vectors when
  you change embedding models.

## Importing from the Galaxy desktop

```sh
blackhole memory import-quasar ~/Library/Application\ Support/galaxy/memory.db
```

Active notes are imported as **confirmed** entries with their provenance, the source
database is backed up under `<state-dir>/import-backups/`, and the import is safe to
re-run.

## Where it lives

```text
<state-dir>/agent.db          SQLite: memories, revisions, FTS index, embeddings
<state-dir>/logs/…            Runtime logs (memory tool calls included)
```

Keep `--state-dir` outside the workspace: a memory database inside the repository would
show up in every diff the agent reviews.
