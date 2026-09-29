# Kiến trúc runtime

`@galaxy-stack/ai-coder-core` là engine mà mọi host của Galaxy nhúng vào. Nó sở hữu vòng lặp
run, context, bằng chứng và gate; nó cố tình không sở hữu bất cứ thứ gì thuộc về
môi trường.

## Port và adapter

| Port | Host cung cấp | Core bảo đảm |
| --- | --- | --- |
| **Model** | Một chat model (Ollama, tương thích OpenAI, một test double) | Vòng lặp, retry, thương lượng thinking, chuẩn hoá streaming |
| **Workspace** | Đọc và ghi tệp, patch, snapshot | Giới hạn phạm vi đường dẫn, ghi nguyên tử kèm precondition, phân loại generated-vs-authored |
| **Command** | Thực thi shell, session có giới hạn | Timeout, giới hạn output, quan sát thay đổi |
| **Tool executor** | Bộ tool và effect profile của chúng | Clamp tham số, hash registry, tính idempotent |
| **Store / trace** | Checkpoint, log | Trạng thái run bền vững, checkpoint chống sửa đổi |

Core chỉ hỗ trợ ESM, chạy trên Node 22.13+, và không kèm provider, filesystem adapter,
command runner, credential store hay UI nào.

## Vòng lặp run

1. **Prepare** — phân giải capability, bộ tool, prompt snapshot và các hash toàn vẹn.
2. **Inspect** — model làm việc với tool cho tới khi nó đề xuất một báo cáo cuối.
3. **Gate** — host đánh giá bằng chứng hoàn thành rồi hoặc kết thúc run, hoặc trả lời bằng
   các issue code cụ thể (xem [bằng chứng](/vi/core/evidence)).
4. **Compact** — khi áp lực context đòi hỏi, một checkpoint bền vững thay thế lịch sử và
   vòng lặp tiếp tục trong một context nhỏ hơn.

Mọi chuyển trạng thái đều được ghi lại: trạng thái run (`preparing`, `inspecting`,
`executing`, `reviewing`, `compacting`, `completed`, `failed`, `cancelled`, `paused`), các
lời gọi tool kèm effect của chúng, token ledger và các quyết định của gate.

## Vì sao việc tách lớp quan trọng

- **Host luôn thay thế được.** CLI, VS Code extension và web harness nhúng cùng một core;
  một bản sửa hành vi (ví dụ độ cũ của validation theo phạm vi) chỉ cần landing một lần.
- **Effect được khai báo, không suy đoán.** Effect profile của một tool nói nó có thể sinh
  bằng chứng validation hay diff review hay không. Một lệnh bắt chước `validate_project`
  thì không: khi đó bằng chứng lại chỉ là lời của model.
- **Ngân sách được nêu rõ.** Số lượt, số lời gọi tool, deadline, retry, các episode
  no-progress và số lần gate từ chối hoàn thành là những con số được cấu hình, không phải
  cảm tính — và CLI phơi ra những cái mà một tác vụ thực sự cần nâng.

## Giới hạn thành thật

| Giới hạn | Hệ quả |
| --- | --- |
| Một agent cho mỗi run | Công việc song song được biểu diễn bằng [subagent](https://github.com/galaxy-blackhole/galaxy-code) hoặc các run riêng, không phải thread bên trong một run |
| CLI không có crash-resume | Checkpoint vẫn tồn tại, nhưng CLI production chưa resume một run đang pause; flow harness resume *bước*, và đó mới là thứ các run dài cần |
| Đếm token chỉ ở mức xấp xỉ | Bộ ước lượng tự hiệu chỉnh theo usage mà provider báo, nên con số thay đổi giữa các run — xem [context và caching](/vi/core/context) |
| Caching phụ thuộc provider | Hành vi cache là của provider; việc của core là giữ prefix ổn định |

Tiếp theo: [bằng chứng và completion gate](/vi/core/evidence).
