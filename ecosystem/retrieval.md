# Retrieval core

`@galaxy/retrieval-core` (`0.1.0`) is the retrieval planning layer: it classifies what a
request wants (intent kinds), turns that into a staged plan, describes the strategies a
stage may use, decides when retrieval should stop (stop reasons), and defines the shared
request/result envelopes that hosts exchange.

```ts
import { RETRIEVAL, type RetrievalIntentKind, type RetrievalStagePlan, type RetrievalStopReason } from '@galaxy/retrieval-core';
```

## What it is, and is not

- **Is** — a contract: types and constants that let a host decide *how* to look something
  up (exact evidence versus broader recall, staged plans, explicit stop conditions)
  without hard-coding that logic in the agent.
- **Is not** — a vector database or a search engine. It plans retrieval; the host
  provides the storage and the scoring.

## Status and honesty

This package is early (`0.1.0`) and has no published API documentation yet — the surface
above is what its type declarations expose today. The runtime's own memory
([`blackhole memory`](/cli/memory)) is deliberately simpler: SQLite with FTS5, and
embeddings when you configure them.

If you are building on it, treat the type declarations as the contract and expect the
shape to move before `1.0`.
