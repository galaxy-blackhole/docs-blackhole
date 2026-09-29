# Giới thiệu

Galaxy Blackhole là một hệ thống AI coding xoay quanh một câu hỏi khó chịu:
*khi agent nói đã xong, làm sao bạn biết là thật?*

Mọi câu trả lời khác trong tài liệu này đều bắt nguồn từ cách chúng tôi trả lời câu đó.

## Các thành phần

| Thành phần | Là gì | Nằm ở đâu |
| --- | --- | --- |
| **`blackhole`** | CLI và TUI: một tác vụ, một phiên chat, flow runner, skills, memory, MCP server, web GUI | `@galaxy-stack/blackhole-cli` |
| **ai-coder-core** | Runtime mà mọi host nhúng vào: ports có kiểu, effect profile của tool, ngân sách context, checkpoint, completion gate | `@galaxy-stack/ai-coder-core` |
| **Web GUI** | `blackhole web` mở harness đã patch với thương hiệu Galaxy, preset PTC và panel hành trình giao hàng | `galaxy-code/src/web` và `galaxy-code/web` |
| **VS Code extension** | Cùng runtime, nằm trong editor | `galaxy-code-vscode` (prototype) |

## Nó dựa vào đâu để biết đã xong

Một run không thể kết thúc chỉ bằng lời của model. Chỉ hai thứ được tính là **bằng chứng
hoàn thành**:

- **`validate_project`** — các check đã khai báo của dự án (test, typecheck, lint, build),
  chạy từ đúng project root mà model chỉ ra.
- **`review_changes` / `git_operation diff`** — review diff cuối cùng.

Lệnh shell không phải bằng chứng, dev server không phải bằng chứng, và một đoạn văn cũng
không. Khi model nhận đã xong, host đánh giá bằng chứng thực có và trả về **mã lỗi cụ thể**
(xem [bằng chứng và completion gate](/vi/core/evidence)). Nhờ vậy CLI mới dám nói thật
*"đã validate: build, test — đã review: diff"* ở cuối tác vụ.

## Năm nguyên tắc thiết kế

**1. Bằng chứng do host sinh ra, không do model khẳng định.**
Kết quả tool mang effect profile: chỉ tool có `validate` hoặc `diff_review` mới sinh được
bằng chứng đó, và gate đọc *effect*, không bao giờ đọc phần tóm tắt.

**2. Vô hiệu hoá giới hạn theo đúng phạm vi đã đổi.**
Một validation bao phủ đúng những đường dẫn nó đã kiểm. Sửa README hay package khác không
làm nó mất hiệu lực; sửa bên trong phạm vi thì có. Thay đổi ngoài luồng (drift) vẫn vô hiệu
hoá **tất cả** — đây là chủ ý.

**3. Context là một ngân sách, không phải hy vọng.**
Runtime phân loại context (bắt buộc, liên quan, linh hoạt), compact bằng checkpoint bền, và
đặt trạng thái đổi-mỗi-lượt ở **cuối** prompt để prefix cache của provider còn dùng được.
Kết quả đo được của quyết định đó: cache hit từ 40% lên 61% trên cùng một flow.

**4. Bộ nhớ dài hạn chờ bạn đồng ý.**
Agent có thể *đề xuất* một quy ước; `blackhole memory confirm` (hoặc harness flow thay mặt
bạn) mới biến nó thành chính thức. Khi recall, nó báo cả **lệch**: trong một run thật, agent
trả lời đúng 5 quy ước đã nhớ và chỉ ra rằng tầng API chưa được nối vào database mà nó nhớ.

**5. Run phải sống được qua thực tế.**
Flow ghi từng sự kiện ra đĩa, resume tại một bước, retry thứ bị mạng đứt hoặc hết hạn giết,
và luôn ghi report kể cả khi chết.

## Không phải là gì

- Không phải dịch vụ hosted: chạy trên máy bạn, với provider bạn chọn.
- Không phải lớp bọc chat: phần thú vị nằm ở hợp đồng runtime bên dưới.
- Chưa hoàn thiện: trang hệ sinh thái ghi rõ cái gì stable, alpha hay prototype — chúng tôi
  thà dán nhãn còn hơn giả vờ.

Tiếp theo: [cài đặt và cấu hình](/vi/guide/getting-started).
