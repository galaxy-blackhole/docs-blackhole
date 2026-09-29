# Delivery journey

A **journey** turns "how does this get to production?" into a file the agent and you can
both read: the blueprint. It is deliberately boring — nodes, edges, a revision number —
because the interesting part is that every run keeps evidence.

## The blueprint

`journey.json` at the workspace root:

```json
{
  "version": 1,
  "revision": 1,
  "updatedAt": "2026-09-28T09:00:00.000Z",
  "updatedBy": "human",
  "variables": {},
  "nodes": [
    { "id": "dev", "kind": "trigger", "title": "Dev xong" },
    { "id": "ci", "kind": "gate", "title": "CI xanh" },
    { "id": "uat", "kind": "action", "title": "UAT" },
    { "id": "approve", "kind": "approval", "title": "Duyệt UAT" },
    { "id": "prod", "kind": "action", "title": "PROD" },
    { "id": "notify", "kind": "notify", "title": "Thông báo" }
  ],
  "edges": [
    { "from": "dev", "to": "ci" },
    { "from": "ci", "to": "uat" },
    { "from": "uat", "to": "approve" },
    { "from": "approve", "to": "prod" },
    { "from": "prod", "to": "notify" }
  ]
}
```

| Node kind | Meaning |
| --- | --- |
| `trigger` | Entry point: work that must exist before the journey can start |
| `gate` | A check that must pass (`ci`, a test suite, a build) |
| `action` | Work that runs — including shell commands, executed in the workspace root |
| `approval` | A human decision; the run waits here |
| `notify` | Announce the outcome |

The blueprint carries a **revision**. Writes are expected to send the revision they read;
a mismatch fails with `journey/conflict` instead of silently overwriting someone else's
edit — the same compare-and-swap idea the file tools use.

## A run

| Step | What happens |
| --- | --- |
| `start` | Freezes the blueprint revision into a run and marks the trigger nodes |
| `advance` | Executes every node whose incoming edges are satisfied (`eligibleNodes`), running commands with a timeout and capturing output |
| `status` / `list` | Where each node is, and which runs exist |
| `decide` | Answers an `approval` node: `approve` → done, `reject` → failed, `retry` → pending, `reset` → pending from any state |
| `cancel` | Stops running and pending nodes; finished evidence stays |

Node states are explicit: `pending`, `running`, `awaiting_approval`, `blocked`,
`done`, `failed`, `cancelled`. A node can only be decided when it is
`awaiting_approval` or `blocked` — you cannot "approve" something that never asked.

Every decision records who made it and why (`note.by`, `note.text`, timestamp), so the
run's history is an audit trail rather than a status field.

## Who drives it

| Driver | How |
| --- | --- |
| You, in the browser | The journey panel renders the blueprint, node states and the decision buttons |
| You, in the terminal | The same blueprint is a file: read it, edit it, commit it |
| The agent | `journey_get` (read), `journey_set` (write with `expectedRevision`), `journey_run` (`start`, `advance`, `status`, `list`, `decide`, `cancel`) |

Because the agent uses the same tools as you, a journey can be *proposed* by the model —
"here is the pipeline I would run, approve it" — and then executed with the same
conflict and evidence rules as everything else.

## Why it is part of the docs

Most agent tooling stops at the pull request. A delivery journey is where the
evidence trail continues: the gate that ran, who approved UAT, which revision of the
blueprint was in force. That is the same principle as the
[completion gate](/core/evidence), applied to shipping instead of coding.
