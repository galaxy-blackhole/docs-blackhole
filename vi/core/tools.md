# Tool, guard và advisory

Tool là hợp đồng giữa runtime và model: nó được làm gì, việc đó tốn bao nhiêu, và nó không
được làm gì kể cả khi được hỏi một cách nhẹ nhàng.

## Danh mục

| Nhóm | Tool |
| --- | --- |
| Workspace | read, write, edit (compare-and-swap), list, glob, search text, stat, diff review |
| Command | `run_command`, session lệnh có giới hạn |
| Project | `detect_project`, `validate_project` |
| Memory | `memory_search`, `memory_remember` |
| Task | Cập nhật checkpoint, tiêu chí nghiệm thu, waive |
| Skills | `skill_list`, `skill_load` |
| Discovery | `search_tools` (kích hoạt tool chuyên biệt theo nhu cầu) |
| Research | Web search/fetch của provider (bật bằng `--research`) |
| MCP | Tool của framework, đặt namespace theo từng server (`mcp_orbit_…`, `mcp_nebula_…`) |

## Effect profile

Mỗi tool khai báo effect của nó, và runtime tin vào khai báo đó:

| Tool | Effect |
| --- | --- |
| `project.validate` | `approval`, `state_version`, `validate`, `write` (output build được tính là derived) |
| `workspace.write`, `workspace.edit` | `approval`, `state_version`, `write` |
| git diff / `review_changes` | `approval`, `diff_review`, `inspect` |
| `command.run` | `approval`, `state_version`, `write` — không bao giờ có `validate` |

Dòng cuối đó chính là toàn bộ vấn đề: một lệnh có thể thay đổi workspace, nhưng nó không thể
*tạo ra* bằng chứng validation. Nếu bạn bắt chước một tool chuyên biệt bằng lệnh shell, gate
nhìn thấy đúng những gì đã xảy ra.

## Guard

| Guard | Hành vi |
| --- | --- |
| **Đường dẫn dependency** | File tool từ chối source thư viện bên trong `node_modules`; một `package.json`, `README.md` hoặc `*.d.ts` cụ thể thì đọc được, và một trình đọc shell trỏ vào cây dependency cũng trả về đúng lời khuyên đó |
| **Chính sách no-progress** | Cùng một lời gọi với cùng tham số lặp lại hai lần → bị chặn; nội dung workspace quay lại hash trước đó → được ghi nhận; episode thứ hai sẽ pause run và hỏi bạn hướng đi |
| **Clamp tham số** | Một tham số dạng số vượt quá maximum của schema sẽ bị clamp về trần và việc điều chỉnh được báo trong kết quả tool thay vì làm lời gọi fail |
| **Precondition cho thay đổi** | Ghi và sửa đều mang một precondition (tạo nếu chưa có, hoặc match-sha256); thao tác sửa yêu cầu `oldText` khớp đúng một lần |
| **Giới hạn output** | Output lớn bị cắt từ đuôi trước và tràn ra một tệp artifact, nên một lệnh `cat` mất kiểm soát không thể nuốt hết context |

## Advisory

Runtime trả lời những sai sót cụ thể bằng một ghi chú trong kết quả tool thay vì từ chối, vì
một lần từ chối tốn một lượt mà chẳng dạy được gì:

| Tình huống | Advisory nói |
| --- | --- |
| Một phép kiểm toàn dự án chạy qua shell | Nên gọi `validate_project` nào thay thế, kèm đường dẫn và check được suy ra từ chính lệnh đó |
| Một server hay watcher chạy dài | Server không phải bằng chứng; hãy dùng capability session có giới hạn nếu tác vụ thực sự cần |
| Một lệnh scaffold của package manager | `bun create vite` tạo khung một dự án; nó không phải một Vite server |
| Một trình đọc shell trỏ vào `node_modules` | Hãy đọc một declaration hoặc manifest thay thế, hoặc dùng kiến thức MCP của framework |
| Một tham số vượt trần của host | Giá trị đã được dùng, và vì sao |

## Thiết kế một tool cho runtime này

1. **Khai báo effect một cách thành thật.** Nếu không thể tin nó như bằng chứng, đừng khai
   `validate` hay `diff_review`.
2. **Ưu tiên precondition hơn là hy vọng.** Compare-and-swap thắng "tôi vừa đọc nó lúc nãy".
3. **Giới hạn output.** Một tool có thể trả về một megabyte thì rồi sẽ có lúc trả về đúng như
   vậy.
4. **Trả lời sai sót bằng lời khuyên.** Một model biết lời gọi đúng cho lần sau có giá trị hơn
   một model chỉ đơn thuần bị chặn lại.
