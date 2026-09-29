# Lệnh và cờ

## `blackhole chat`

TUI tương tác. Xem [tour giao diện dòng lệnh](/vi/guide/tui).

## `blackhole run "task"`

Một tác vụ, một kết quả cuối. Runtime đọc workspace, sửa, validate và review, rồi trả lời
kèm bằng chứng nó đã tạo.

```sh
blackhole run "thêm endpoint GET /health và test cho nó"
blackhole run "…" --json | jq '.state, .validation'
blackhole run "…" --max-turns 80 --run-minutes 30
blackhole run "…" --allow-tool workspace.write --allow-tool project.validate
```

`--json` in một object kết quả: `state`, `content`, `validation`, `writes`, `checkpoint`,
`error`. Đây là giao diện dành cho script và CI.

## `blackhole flow <file.json>`

Chạy chuỗi prompt tuần tự trong một session và workspace, có log từng bước, kỳ vọng tool và
report cuối. Xem [flow và kiểm chứng E2E](/vi/guide/flow-and-e2e).

```sh
blackhole flow flows/gymflow.json --workspace /tmp/e2e/ws --state-dir /tmp/e2e/state --flow-out /tmp/e2e/out
blackhole flow flows/gymflow.json --flow-from s09-security --flow-until s10-api-key --run-minutes 90
```

| Cờ | Tác dụng |
| --- | --- |
| `--flow-out <dir>` | Nơi ghi `step-*.ndjson`, `progress.log` và `flow-report.json` |
| `--flow-from <step-id>` | Bắt đầu ở bước này (các bước trước được ghi là skipped) |
| `--flow-until <step-id>` | Dừng sau bước này |
| `--flow-step-retries <n>` | Thử lại bước chết vì mạng hoặc hết hạn host (mặc định 1) |
| `--flow-stop-on-error` | Dừng ngay ở bước fail hoặc thiếu kỳ vọng đầu tiên |

## `blackhole web [options]`

| Lệnh / cờ | Tác dụng |
| --- | --- |
| `blackhole web` | Mở GUI (mặc định port `3090`, tự mở trình duyệt) |
| `blackhole web doctor [--json]` | Kiểm runtime harness, patch đi kèm và khoá Galaxy |
| `blackhole web config` | In các đường dẫn đã resolve |
| `--port <n>` `--host <h>` | Địa chỉ bind |
| `--profile <name>` `--home <dir>` | Profile và home của harness (mặc định tách biệt) |
| `--model <id>` `--preset <name>` | Model mặc định và agent preset (`ptc`) |
| `--patch <file>` | Patch overlay thêm (lặp lại được) |
| `--no-brand` `--no-open` `--dry-run` `--json` | Tắt brand, không mở trình duyệt, chỉ resolve, xuất JSON |

Chi tiết: [web GUI](/vi/web/).

## `blackhole memory …`

| Lệnh | Tác dụng |
| --- | --- |
| `memory search <query>` | Recall ghi chú đã confirmed (candidate chỉ khi `--include-candidates`) |
| `memory list` | Liệt kê ghi chú, kể cả candidate |
| `memory remember <key> <text>` | Lưu ghi chú **do người dùng xác nhận** |
| `memory confirm <key>` | Nâng revision candidate hiện tại thành confirmed |
| `memory history <key>` | Các revision và nguồn gốc |
| `memory forget <key>` | Xoá mọi revision của một key |
| `memory consolidate` | Dọn revision bị thay thế và vector mồ côi |
| `memory import-quasar <path>` | Nhập database memory của Galaxy desktop (Quasar) |

Chi tiết: [memory](/vi/cli/memory).

## `blackhole skills …`

| Lệnh | Tác dụng |
| --- | --- |
| `skills`, `skills show <id>` | Liệt kê skill đã cài, hoặc xem một skill |
| `skills search <query>` | Tìm trong index đã cấu hình |
| `skills install <id>` [`--skill-version <range>`] | Cài từ marketplace |
| `skills update` | Cập nhật lên bản mới nhất thoả range |
| `skills remove <id>` | Gỡ |

Chi tiết: [skills](/vi/cli/skills).

## `blackhole mcp …`

| Lệnh | Tác dụng |
| --- | --- |
| `mcp` | Kết nối server đã cấu hình và liệt kê tool |
| `mcp login <server>` | OAuth qua trình duyệt cho server khai báo `"auth": "oauth"` |
| `mcp logout <server>` | Quên token đã lưu |

Chi tiết: [MCP server](/vi/cli/mcp).

## `blackhole sessions` và `blackhole logs [n]`

`sessions` liệt kê session hội thoại kèm id (dùng với `--session`); `logs` in các dòng log
runtime mới nhất — thứ đầu tiên nên lấy khi báo lỗi.
