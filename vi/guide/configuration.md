# Tham chiếu cấu hình

## Cờ dòng lệnh

| Cờ | Ý nghĩa |
| --- | --- |
| `--version`, `-v` | In phiên bản CLI |
| `--workspace <dir>` | Thư mục dự án (mặc định: thư mục hiện tại) |
| `--state-dir <dir>` | Session, memory, checkpoint, log; phải nằm ngoài workspace (mặc định `~/.galaxy/agent`) |
| `--session <id>` | Mở lại một session hội thoại theo id |
| `--model <id>`, `--base-url <url>` | Ghi đè provider cho lần chạy này |
| `--config <path>` | File cấu hình provider (mặc định `~/.galaxy/config.json`, lấy entry `manual` đầu tiên) |
| `--agent-config <json>` | Tài liệu cấu hình agent (mặc định `~/.galaxy/agent.json`) |
| `--profile coding\|assistant\|research` | Hồ sơ agent; `coding` bắt buộc phải đọc workspace trước khi kết thúc |
| `--thinking <level>` | `auto\|default\|off\|on\|minimal\|low\|medium\|high\|xhigh\|max`; mức khả dụng tuỳ model, `auto`/`default` không gửi trường thinking |
| `--allow-tool <canonical-id>` | Xác nhận trước một tool cho run không tương tác; lặp lại được |
| `--approval full\|balanced` | `full` (mặc định) không hỏi; `balanced` hỏi trước tool có effect nguy hiểm |
| `--embedding-model <id>`, `--embedding-base-url <url>` | Bật memory ngữ nghĩa (ví dụ `bge-m3`) |
| `--skills-index <path-or-url>`, `--skills-dir <dir>`, `--skills-public-key <pem>`, `--skill-version <range>` | Marketplace skill và xác minh chữ ký |
| `--no-galaxy-mcp` | Bỏ qua MCP server `orbit` và `nebula` đi kèm |
| `--system-prompt-in-history` / `--no-system-prompt-in-history` | Ép chiến lược cập nhật system prompt; mặc định theo danh sách model đã kiểm |
| `--research` | Bật web search/fetch của provider (`search_web` được phát hiện lười qua `search_tools`) |
| `--json` | `run`/`flow`: một kết quả cho máy đọc thay vì TUI |
| `--max-turns <n>`, `--run-minutes <n>` | Số lượt model (mặc định 48) và hạn host (mặc định 15 phút) cho một run |
| `--flow-from <step-id>`, `--flow-until <step-id>` | Resume một flow, hoặc giới hạn nó trong một khoảng |
| `--flow-step-retries <n>` | Số lần thử thêm khi bước chết vì mạng hoặc hết hạn host |

## Hồ sơ (profile)

| Profile | Hành vi |
| --- | --- |
| `coding` (mặc định) | Giả định có repository: bắt buộc đọc trước khi kết thúc, và diff review được mong đợi |
| `assistant` | Ưu tiên hội thoại; không bắt buộc inspection |
| `research` | Hướng nghiên cứu, có kỳ vọng trích dẫn nguồn |

## Mức suy luận

Thinking là thứ **thương lượng**, không phải áp đặt: CLI hỏi provider xem model hỗ trợ gì và
chỉ đưa ra những mức có thể tôn trọng. `auto` và `default` không gửi trường thinking — lựa
chọn an toàn nhất với model mới. Trong TUI, `Ctrl+T` đổi mức và `/effort` mở bảng chọn.

## Quyền (approval)

`--approval full` là mặc định vì CLI thường được dùng bởi người đang nhìn transcript. Với
run không tương tác (CI, script), hoặc giữ `full`, **hoặc** xác nhận trước đúng những tool
bạn chờ đợi bằng `--allow-tool`; runtime từ chối đoán khi không hỏi được, và báo rõ tool mà
nó dừng lại.

## Biến môi trường

| Biến | Tác dụng |
| --- | --- |
| `PORT`, `CORS_ORIGIN` | Thuộc về **dự án của bạn**, không phải CLI — nhưng app do flow E2E sinh ra dùng chúng nên chúng xuất hiện trong log flow |
| `GBH_*`, `GALAXY_*` | Được launcher `gbh` và web GUI đọc (xem [web GUI](/vi/web/)) |
| `DSH_HOME` | Nơi harness mà `blackhole web` dùng giữ profile và cache |

Khoá provider thuộc về `~/.galaxy/config.json` (mode 0600) hoặc secret manager của bạn —
đừng để trong file thuộc workspace, nơi diff review sẽ phơi nó ra.

Tiếp theo: [giao diện dòng lệnh](/vi/guide/tui).
