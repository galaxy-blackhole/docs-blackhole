# Giao diện dòng lệnh (TUI)

Chạy `blackhole` không kèm lệnh để mở TUI.

## Phím tắt

| Phím | Tác dụng |
| --- | --- |
| `Enter` | Gửi prompt |
| `Esc` | Dừng lượt đang chạy (run kết thúc là *cancelled*, không phải *failed*) |
| `Ctrl+C` | Thoát CLI |
| `Ctrl+P` | Chọn model cho lượt kế tiếp |
| `Ctrl+T` | Đổi nhanh mức suy luận |
| `Ctrl+L` | Ẩn/hiện nội dung thinking trong transcript |
| `Ctrl+O` | Mở/đóng chi tiết lời gọi tool |
| `Ctrl+S` | Mở skills và marketplace |
| `Ctrl+G` | Về cuối transcript |
| `PgUp` / `PgDn` | Cuộn transcript |
| `y` / `n` | Trả lời câu hỏi xin quyền dùng tool (khi `--approval balanced`) |

## Lệnh dấu sổ

Gõ `/` trong ô nhập để mở menu:

| Lệnh | Việc |
| --- | --- |
| `/help` | Phím tắt và danh sách lệnh |
| `/model` | Chọn model cho lượt kế tiếp |
| `/effort` | Chọn mức suy luận |
| `/thinking` | Ẩn/hiện thinking |
| `/tools` | Ẩn/hiện chi tiết tool |
| `/skills` | Skills và marketplace |
| `/diff` | Xem diff gần nhất toàn màn hình (`↑`/`↓`, `PgUp`/`PgDn` cuộn, `Esc` đóng) |
| `/session` | Thông tin phiên, workspace, provider và log |
| `/clear` | Xoá transcript (lịch sử phiên vẫn lưu trên đĩa) |
| `/quit` | Thoát |

## Đọc transcript

- Mỗi dòng có tiền tố vai trò: prompt của bạn, trợ lý, lời gọi tool, kết quả tool, lần
  gate từ chối hoàn thành, hoặc chuyển trạng thái.
- Từ ba lời gọi tool liên tiếp trở lên được gộp thành một dòng
  `⚙ N lần gọi công cụ · ✔ …`; `Ctrl+O` để mở.
- Diff được tô màu (thêm/bớt) trong một số dòng giới hạn; `/diff` xem toàn bộ patch.
- Khi gate từ chối hoàn thành, mã lỗi hiện **ngay trong transcript** để bạn thấy lý do,
  chứ không nằm im trong log.
- Cuối mỗi lượt có footer: thương hiệu provider, model, mức suy luận, token, thời gian.

## Ghi log trong lúc làm việc

TUI ghi cùng loại JSON lines như mọi lệnh khác — chuyển trạng thái run, lỗi tool kèm
stack, retry model, lỗi MCP — vào `<state-dir>/logs/cli-<ngày>.ndjson`.
`blackhole logs [n]` in các dòng mới nhất; đây là thứ nên gửi kèm khi báo lỗi.
