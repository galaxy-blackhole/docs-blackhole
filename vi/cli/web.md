# `blackhole web`

`blackhole web` mở web GUI Galaxy Blackhole: một harness agent đã patch với thương hiệu Galaxy,
duy nhất preset `ptc`, home tách biệt, và panel hành trình giao hàng.

```sh
blackhole web                       # mặc định: http://127.0.0.1:3090, tự mở trình duyệt
blackhole web --port 3200 --no-open
blackhole web doctor                # kiểm runtime harness, patch và khoá Galaxy
blackhole web config                # in các đường dẫn đã resolve
blackhole web --dry-run --json      # resolve tất cả, không khởi động gì
```

| Cờ | Tác dụng |
| --- | --- |
| `--port <n>` / `--host <h>` | Địa chỉ bind (mặc định `3090`, loopback) |
| `--profile <name>` | Profile harness sẽ mở |
| `--home <dir>` | Home harness tách biệt (mặc định dưới `~/.galaxy/`) |
| `--model <id>` | Model mặc định cho GUI |
| `--preset <name>` | Agent preset (`ptc`) |
| `--patch <file>` | Patch overlay thêm, lặp lại được |
| `--no-brand` | Mở không kèm overlay thương hiệu Galaxy |
| `--open` / `--no-open` | Có mở trình duyệt hay không |
| `--dry-run` / `--json` | Resolve và báo cáo mà không khởi động |

## Overlay Galaxy thay đổi gì

GUI là bề mặt web của harness gốc cộng ba patch overlay nằm trong package CLI:

| Patch | Mục đích |
| --- | --- |
| `gbh-web` | Overlay nền: preset PTC, route model Galaxy, ghim phiên bản harness |
| `gbh-ui` | Đơn giản hoá: ẩn bảng chọn preset và bề mặt quản lý plugin, vì PTC là preset duy nhất còn tool plugin vẫn được mount |
| `gbh-brand` | Thay thương hiệu sidebar gốc bằng Galaxy Blackhole (mark + tên) |

Patch được kiểm chứng trên một bản harness ghim cụ thể; `blackhole web doctor` báo phiên bản
nó thấy, patch đã áp và có khoá Galaxy hay chưa — cách nhanh nhất để phân biệt lỗi môi trường
và lỗi bản build.

## Thương hiệu và ngôn ngữ

- `web/brand/` chứa bundle thương hiệu: một client plugin, logo, favicon, và file locale tiếng
  Việt dùng cho GUI.
- Các context producer của harness được đổi nhãn thành *System prompt* để transcript đọc giống
  timeline của chính CLI.

## Trạng thái lưu ở đâu

| Đường dẫn | Nội dung |
| --- | --- |
| `~/.galaxy/<harness-home>/` | Profile, cache, session của harness (tách khỏi home harness toàn cục) |
| `<state-dir>/logs/cli-<ngày>.ndjson` | Quyết định khởi động, patch và credential |
| `<state-dir>/mcp-auth.json` | Token OAuth của MCP (0600) |

GUI dùng chung credential provider với CLI, nên khoá đã cấu hình cho terminal dùng được luôn
trong trình duyệt, không cần thiết lập lần hai.

Tiếp theo: [tổng quan web GUI](/vi/web/) và [hành trình giao hàng](/vi/web/journey).
