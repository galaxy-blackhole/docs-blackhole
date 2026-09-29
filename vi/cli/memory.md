# Memory

Memory là cách agent giữ quy ước của bạn qua nhiều phiên mà không giả vờ nhớ những thứ bạn
chưa từng đồng ý.

## Mô hình

| Khái niệm | Ý nghĩa |
| --- | --- |
| **Key** | Định danh ổn định, thường có dấu chấm: `gymflow.database`, `acme.api.prefix` |
| **Scope** | `workspace:<sha256>` — ghi chú viết ở repo này không nhìn thấy ở repo khác |
| **Trust** | `candidate` (agent đề xuất) hoặc `confirmed` (người, hoặc harness flow thay mặt người, đã duyệt) |
| **Revision** | Mỗi lần confirm tăng revision; revision cũ giữ lại ở trạng thái `superseded` |
| **Status** | `active` khi còn hiệu lực; `superseded` khi đã có revision mới hơn |

Chỉ ghi chú **confirmed + active** mới được recall như chân lý. Candidate vẫn xem được bằng
`blackhole memory list`, để bạn thấy agent muốn nhớ gì trước khi nó thành sự thật.

## Hằng ngày

```sh
blackhole memory remember gymflow.database "SQLite file gymflow.db, truy cập bằng bun:sqlite"
blackhole memory list
blackhole memory search "database port"
blackhole memory history gymflow.database
blackhole memory forget gymflow.database
```

Trong TUI, agent tự đề xuất ghi chú; `blackhole memory confirm <key>` (hoặc harness flow, với
run không người trực) biến chúng thành memory.

## Recall bên trong một run

Recall là một lời gọi tool, không phải prefix ẩn trong prompt. Agent gửi
`memory_search("gymflow conventions port database api prefix …")` và nhận lại các bản ghi
confirmed kèm scope và revision. Trong một run thật, agent đã:

1. tìm lại các quy ước được dặn;
2. trả lời đủ cả năm (port, database, tiền tố API, API key, frontend);
3. **báo lệch** — tầng API vẫn dùng Map trong bộ nhớ thay vì database mà nó nhớ — và sau đó
   sửa lại.

Sự kết hợp đó (recall, đối chiếu với workspace, báo lệch) chính là mục đích của tính năng:
bộ nhớ được **kiểm tra**, không được tin tuyệt đối.

## Recall hoạt động thế nào

- **Mặc định: lexical (FTS5).** Nhanh, chính xác, offline; từ đồng nghĩa mà ghi chú không chứa
  sẽ không khớp.
- **Tuỳ chọn: ngữ nghĩa.** Truyền `--embedding-model <id> --embedding-base-url <url>` (ví dụ
  `bge-m3`) để recall chạy thêm trên embedding — đó là thứ giúp `"cổng"` khớp `"port"`.
- `blackhole memory consolidate` dọn revision bị thay thế và vector mồ côi khi bạn đổi model
  embedding.

## Nhập từ Galaxy desktop

```sh
blackhole memory import-quasar ~/Library/Application\ Support/galaxy/memory.db
```

Ghi chú đang active được nhập thành bản **confirmed** kèm nguồn gốc, database nguồn được sao
lưu dưới `<state-dir>/import-backups/`, và thao tác này chạy lại được an toàn.

## Nằm ở đâu

```text
<state-dir>/agent.db          SQLite: memories, revisions, chỉ mục FTS, embeddings
<state-dir>/logs/…            Log runtime (kể cả lời gọi tool memory)
```

Giữ `--state-dir` ngoài workspace: database memory nằm trong repo sẽ xuất hiện trong mọi diff
mà agent review.
