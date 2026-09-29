# Bằng chứng và completion gate

Gate là lý do dự án này tồn tại. Nó trả lời một câu hỏi bằng dữ liệu thay vì bằng lời
văn: *run này có được phép kết thúc không?*

## Cái gì được tính là bằng chứng

| Bằng chứng | Sinh ra bởi | Ghi chú |
| --- | --- | --- |
| Validation | `validate_project` | Chạy các check đã khai báo của dự án (test, typecheck, lint, build) tại một đường dẫn dự án |
| Diff review | `review_changes` hoặc thao tác git diff của host | Bắt buộc sau lần ghi cuối cùng |
| Inspection | Các lần đọc workspace | Được profile `coding` yêu cầu trước khi hoàn thành |
| Báo cáo cuối | Message cuối cùng của model | Phải khác rỗng và được lưu lại |

Một lệnh shell **không phải** validation, dù nó trông xanh thế nào. Đó là lý do
`blackhole run "bun test"` không sinh bằng chứng: runtime trả về một advisory nêu đúng
lời gọi `validate_project` cần dùng thay thế, và completion gate sẽ từ chối run nếu không
có gì khác bao phủ những tệp đó.

## Issue code

Khi gate từ chối, nó nói chính xác vì sao:

| Mã | Ý nghĩa |
| --- | --- |
| `INSPECTION_MISSING` | Profile `coding` yêu cầu đọc trước khi ghi |
| `VALIDATION_MISSING` | Host yêu cầu ít nhất một validation đạt |
| `VALIDATION_FAILED` | Validation mới nhất của một id đã fail |
| `WRITE_NOT_VALIDATED` | Một đường dẫn đã ghi và còn tồn tại không có validation nào sau đó bao phủ |
| `WRITE_EVIDENCE_INVALID` | Một lần ghi đã được ghi nhận nhưng thiếu bằng chứng thay đổi hợp lệ |
| `WORKSPACE_EVIDENCE_STALE` | Có thứ nằm trong phạm vi validation bị đổi sau khi nó chạy, hoặc workspace drift mà không có hoạt động nào được theo dõi để giải thích |
| `DIFF_NOT_REVIEWED` | Diff cuối cùng bị thiếu, cũ hơn lần ghi cuối, hoặc đến từ một trạng thái workspace khác |
| `FINAL_REPORT_EMPTY`, `FINAL_REPORT_NOT_STORED` | Run không có gì để báo cáo, hoặc báo cáo đã không được lưu lại |
| `OPEN_PROBLEMS`, `PENDING_APPROVAL` | Run vẫn còn biết về công việc chưa giải quyết hoặc một câu hỏi chưa được trả lời |
| `ACCEPTANCE_CRITERIA_OPEN` | Một tiêu chí nghiệm thu bắt buộc chưa được thoả cũng chưa được waive |
| `RESEARCH_CITATION_MISSING`, `RESEARCH_CITATION_UNSUPPORTED`, `RESEARCH_EVIDENCE_MISSING` | Khẳng định nghiên cứu không có nguồn thật và truy cập thành công |
| `RUNNING_TOOL_CALL`, `TOKEN_LEDGER_NOT_FINALIZED`, `TRACE_NOT_FINALIZED` | Run cố kết thúc khi còn việc đang chạy dở; host đóng sổ trước đã |

## Vô hiệu hoá theo phạm vi

Quy tắc thay đổi nhiều nhất trong quá trình phát triển:

- Một validation bao phủ **đúng những đường dẫn nó đã kiểm**. Ghi bên trong phạm vi đó thì
  vô hiệu hoá nó; ghi bên ngoài (một package anh em, một README) thì không.
- **Ghi tài liệu** (`.md`, `.mdx`, `.txt`, `docs/`, LICENSE) không cần validation và không
  vô hiệu hoá gì: một README không thể làm hỏng build.
- **Đường dẫn đã xoá** không cần validation. Một file nháp được ghi rồi xoá thì không thể
  validate khi nó đã biến mất — đòi hỏi điều đó chỉ đốt thêm một lượt.
- **Drift ngoài luồng** — fingerprint của workspace thay đổi mà không có lần ghi nào được
  theo dõi để giải thích — vẫn vô hiệu hoá *mọi thứ*. Nếu có thứ gì đó ngoài agent sửa tệp
  của bạn, run phải nhìn lại.
- Một validation được ghi tại workspace root vẫn giữ phạm vi nghiêm ngặt là toàn workspace.

Trước đây, chỉ một lần sửa README là vô hiệu hoá mọi validation trong run và buộc phải chạy
lại toàn bộ chu kỳ validation; một ngày chạy có tới hai mươi mốt lần như vậy.

## Khi gate từ chối

Một lần từ chối không phải là thất bại — đó là một chỉ dẫn khắc phục. Runtime nói cho model
biết bằng chứng nào còn thiếu và để nó tiếp tục:

- Số lần từ chối là **có giới hạn** (`maxCompletionRejections`, mặc định 3). Một model cứ
  khẳng định đã xong mà không có bằng chứng sẽ kết thúc run với `NO_PROGRESS` thay vì lặp.
- Chạm **ngân sách lượt** thì được cấp một lượt finalization không tool, nên một run đã đủ
  bằng chứng vẫn báo cáo được. Hết lượt lần thứ hai thì run fail.
- Ở chế độ finalization, danh sách tool bị bỏ đi: model nói được, nhưng không hành động được.

## Waive và sự thành thật

Các tiêu chí nghiệm thu bắt buộc có thể được waive — một cách tường minh, kèm id bằng chứng,
và được ghi vào checkpoint. Đó là lối thoát cho "tôi không kiểm chứng được điều này, đây là
lý do", một câu trả lời hoàn toàn hợp lệ. Thứ không có là âm thầm báo cáo thành công.
