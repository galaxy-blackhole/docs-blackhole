# Tổng quan lệnh CLI

| Lệnh | Việc |
| --- | --- |
| `blackhole chat` | TUI tương tác (mặc định khi không truyền lệnh) |
| `blackhole run "task"` | Một tác vụ, một kết quả cuối (`--json` cho máy đọc) |
| `blackhole flow <file.json>` | Chạy chuỗi prompt trong một session, log từng bước |
| `blackhole web [options]` | Web GUI Galaxy Blackhole (kèm `doctor`/`config`) |
| `blackhole skills …` | Tìm, cài, cập nhật, gỡ skill |
| `blackhole mcp …` | Kết nối MCP server, liệt kê tool, quản lý OAuth |
| `blackhole memory …` | Memory theo workspace: search, list, confirm, history, forget, consolidate |
| `blackhole sessions` | Liệt kê session hội thoại |
| `blackhole logs [n]` | Các dòng log mới nhất |
| `blackhole help`, `--version` | Trợ giúp và phiên bản |

## Cờ toàn cục hay dùng

```text
--workspace <dir>            thư mục dự án (mặc định: thư mục hiện tại)
--state-dir <dir>            session, memory, checkpoint, log (mặc định ~/.galaxy/agent)
--session <id>               mở lại một session hội thoại
--model <id> --base-url <url>  ghi đè provider cho lần chạy này
--profile coding|assistant|research
--approval full|balanced
--allow-tool <canonical-id>  xác nhận trước một tool (lặp lại được)
--thinking auto|default|off|on|minimal|low|medium|high|xhigh|max
--embedding-model <id> --embedding-base-url <url>   memory ngữ nghĩa
--research                   bật web search/fetch của provider
--no-galaxy-mcp              bỏ qua MCP server orbit/nebula đi kèm
--json                       run/flow: một kết quả cho máy đọc
--max-turns <n> --run-minutes <n>
--flow-from <step-id> --flow-until <step-id> --flow-step-retries <n>
```

Mô tả đầy đủ: [lệnh và cờ](/vi/cli/commands) và
[tham chiếu cấu hình](/vi/guide/configuration).

## Mã thoát

| Mã | Ý nghĩa |
| --- | --- |
| `0` | Run hoàn tất và bằng chứng thoả completion gate |
| `1` | Run thất bại, hoặc flow không đạt kỳ vọng |
| `130` | Run bị huỷ (`Esc`, `SIGINT`) |

Run bị huỷ **không phải** run thất bại: session, memory và workspace vẫn dùng được, và
flow có thể chạy tiếp bằng `--flow-from`.

## Log

```sh
blackhole logs 20
tail -f ~/.galaxy/agent/logs/cli-$(date +%F).ndjson
```

Mỗi dòng là một JSON line: vòng đời lệnh, chuyển trạng thái run, lỗi tool kèm stack, retry
model, lỗi kết nối MCP, sự kiện OAuth và crash. Secret được che trước khi dòng đó được ghi.

Tiếp theo: [lệnh và cờ](/vi/cli/commands).
