# Evidence and the completion gate

The gate is the reason this project exists. It answers one question with data instead of
prose: *may this run end?*

## What counts as evidence

| Evidence | Produced by | Notes |
| --- | --- | --- |
| Validation | `validate_project` | Runs the project's declared checks (test, typecheck, lint, build) at a project path |
| Diff review | `review_changes` or the host's git diff operation | Required after the last write |
| Inspection | Workspace reads | Required by the `coding` profile before completion |
| Final report | The model's last message | Must be non-empty and persisted |

A shell command is **not** validation, however green it looks. That is why
`blackhole run "bun test"` produces no evidence: the runtime answers with an advisory
naming the exact `validate_project` call instead, and the completion gate would refuse
the run if nothing else covered those files.

## Issue codes

When the gate refuses, it says exactly why:

| Code | Meaning |
| --- | --- |
| `INSPECTION_MISSING` | The `coding` profile requires reading before writing |
| `VALIDATION_MISSING` | The host requires at least one passing validation |
| `VALIDATION_FAILED` | The newest validation for an id failed |
| `WRITE_NOT_VALIDATED` | A surviving written path has no later validation covering it |
| `WRITE_EVIDENCE_INVALID` | A recorded write lacks valid mutation evidence |
| `WORKSPACE_EVIDENCE_STALE` | Something the validation covered changed after it ran, or the workspace drifted with no tracked activity to explain it |
| `DIFF_NOT_REVIEWED` | The final diff is missing, older than the last write, or from a different workspace state |
| `FINAL_REPORT_EMPTY`, `FINAL_REPORT_NOT_STORED` | The run has nothing to report, or it was not persisted |
| `OPEN_PROBLEMS`, `PENDING_APPROVAL` | The run still knows about unresolved work or an unanswered question |
| `ACCEPTANCE_CRITERIA_OPEN` | A required acceptance criterion is neither satisfied nor waived |
| `RESEARCH_CITATION_MISSING`, `RESEARCH_CITATION_UNSUPPORTED`, `RESEARCH_EVIDENCE_MISSING` | Research claims without a real, successful source |
| `RUNNING_TOOL_CALL`, `TOKEN_LEDGER_NOT_FINALIZED`, `TRACE_NOT_FINALIZED` | The run tried to finish mid-flight; the host closes its books first |

## Scope-aware invalidation

The rule that changed the most during development:

- A validation covers **the paths it validated**. A write inside that scope invalidates
  it; a write outside it (a sibling package, a README) does not.
- **Documentation writes** (`.md`, `.mdx`, `.txt`, `docs/`, LICENSE) require no
  validation and invalidate nothing: a build cannot be broken by a README.
- **Deleted paths** require no validation. A scratch probe that was written and removed
  cannot be validated once it is gone — demanding it just burns a round.
- **Untracked drift** — the workspace fingerprint moving with no tracked write to explain
  it — still invalidates *everything*. If something outside the agent edited your files,
  the run must look again.
- A validation recorded at the workspace root keeps the strict, whole-workspace scope.

Before this, a single README edit voided every validation in the run and forced a full
re-validation cycle; a day of runs contained twenty-one of them.

## When the gate rejects

A rejection is not a failure — it is a remediation. The runtime tells the model which
evidence is missing and lets it continue:

- Rejections are **bounded** (`maxCompletionRejections`, default 3). A model that keeps
  claiming completion without evidence ends the run with `NO_PROGRESS` instead of
  looping.
- Reaching the **turn budget** grants one tool-free finalization turn, so a run whose
  evidence is already satisfied can still report. A second exhaustion fails the run.
- In finalization mode the tool list is dropped: the model can talk, not act.

## Waivers and honesty

Required acceptance criteria can be waived — explicitly, with an evidence id, recorded in
the checkpoint. That is the escape hatch for "I could not verify this, here is why",
which is a legitimate answer. What is not available is quietly reporting success.
