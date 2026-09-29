# Cài đặt và cấu hình

## Yêu cầu

- **Node.js 22.13 trở lên** (runtime dùng SQLite có sẵn cho memory và session).
- Một model provider: **Ollama** (mặc định `https://ollama.com`) hoặc endpoint **tương
  thích OpenAI**.

## Cài

```sh
npm i -g @galaxy-stack/blackhole-cli
blackhole --version
```

Bản `x.y.z` (không có `-alpha`) là bản **đã kiểm chứng**: chỉ phát hành sau khi
[flow 25 prompt](/guide/flow-and-e2e) chạy xong trên chính bản đó. Việc đang làm dở nằm ở
dist-tag `alpha` — xem [chính sách release](/reference/release-policy).

## Trỏ vào model

CLI đọc provider từ `~/.galaxy/config.json` (đổi bằng `--config <path>`):

```json
{
  "agent": [
    {
      "type": "manual",
      "apiKey": "…",
      "baseUrl": "https://ollama.com",
      "model": "deepseek-v4.1-flash:cloud",
      "reasoningEfforts": ["low", "medium", "high"]
    }
  ]
}
```

- `baseUrl` mặc định `https://ollama.com`; `model` mặc định
  `deepseek-v4.1-flash:cloud`.
- `reasoningEfforts` là tuỳ chọn: khai báo model nhận những mức suy luận nào; CLI không
  bao giờ gửi mức mà model không hỗ trợ.
- Có thể ghi đè từng lần chạy bằng `--model`, `--base-url`, `--agent-config <json>`.

## Lần chạy đầu tiên

```sh
blackhole chat                                  # TUI trong thư mục hiện tại
blackhole run "thêm endpoint GET /health"       # một tác vụ, một kết quả
blackhole run "…" --json                        # kết quả cho máy đọc
```

Vài cờ nên biết:

| Cờ | Khi nào dùng |
| --- | --- |
| `--workspace <dir>` | Trỏ vào repo mà không cần `cd` |
| `--state-dir <dir>` | Giữ session/memory/log **ngoài** workspace (mặc định `~/.galaxy/agent`) |
| `--profile coding\|assistant\|research` | Đổi giả định vận hành của agent |
| `--max-turns <n>` / `--run-minutes <n>` | Cho tác vụ lớn nhiều thời gian hơn mặc định 48 lượt / 15 phút |
| `--approval full\|balanced` | `full` không hỏi; `balanced` hỏi trước tool nguy hiểm |

## Trạng thái được lưu ở đâu

| Đường dẫn | Nội dung |
| --- | --- |
| `~/.galaxy/config.json` | Provider (`--config`) |
| `~/.galaxy/agent.json` | Cấu hình agent (`--agent-config`) |
| `~/.galaxy/agent/` | State mặc định: session, database memory, checkpoint, `logs/cli-<ngày>.ndjson` |
| `<workspace>/.galaxy/workspace.json` | Ghi chú của agent về các thư mục sinh tự động (build output) |

`--state-dir` **phải nằm ngoài workspace**: state trong repo sẽ làm bẩn chính diff mà
agent phải review.

## Kiểm tra bản cài

```sh
blackhole --version
blackhole memory list
blackhole logs 5
```

Mọi lệnh ghi log JSON lines vào `<state-dir>/logs/cli-<ngày>.ndjson` (mode 0600, tự
rotate), secret được che trước khi ghi — nên sau khi terminal đóng vẫn truy được lỗi.

Tiếp theo: [giao diện dòng lệnh](/vi/guide/tui), hoặc [bản đầy đủ tiếng Anh](/guide/configuration).
