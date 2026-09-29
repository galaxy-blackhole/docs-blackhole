# Retrieval core

`@galaxy/retrieval-core` (`0.1.0`) là tầng planning cho retrieval: nó phân loại điều một
request muốn (intent kind), biến nó thành một plan theo stage, mô tả những strategy mà một
stage có thể dùng, quyết định khi nào retrieval nên dừng (stop reason), và định nghĩa các
envelope request/result dùng chung mà các host trao đổi với nhau.

```ts
import { RETRIEVAL, type RetrievalIntentKind, type RetrievalStagePlan, type RetrievalStopReason } from '@galaxy/retrieval-core';
```

## Nó là gì, và không là gì

- **Là** — một hợp đồng: các type và hằng số cho phép host quyết định *cách* tra cứu một thứ
  (bằng chứng chính xác hay recall rộng hơn, plan theo stage, điều kiện dừng tường minh) mà
  không phải hard-code logic đó vào agent.
- **Không là** — một vector database hay một search engine. Nó plan retrieval; host cung cấp
  storage và scoring.

## Trạng thái và sự thành thật

Package này còn sớm (`0.1.0`) và chưa có tài liệu API nào được phát hành — bề mặt nêu trên là
những gì type declaration của nó phơi ra ở thời điểm hiện tại. Memory của chính runtime
([`blackhole memory`](/vi/cli/memory)) thì cố tình đơn giản hơn: SQLite với FTS5, và embedding
khi bạn cấu hình chúng.

Nếu bạn đang xây dựng dựa trên nó, hãy coi type declaration là hợp đồng và lường trước rằng
hình dạng của nó sẽ còn thay đổi trước `1.0`.
