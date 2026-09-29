# Nhật ký lỗi

Những lỗi dưới đây là lý do bản release hiện tại hành xử theo cách nó đang hành xử. Mỗi lỗi
được tìm ra bằng cách chạy flow end-to-end, chẩn đoán từ log thay vì từ trực giác, và sửa kèm
một regression test. Bản đầy đủ — bằng tiếng Việt, kèm trích đoạn log thô — nằm ở
[`galaxy-code/docs/TEST_FAILURE_ANALYSIS.md`](https://github.com/galaxy-blackhole/galaxy-code/blob/main/docs/TEST_FAILURE_ANALYSIS.md).

## 1. Agent tốn một bước chỉ để chứng minh dev server chạy được

**Hiện tượng** — một bước scaffold không bao giờ kết thúc: hơn mười hai lần gọi `vite`/`bun run dev`,
dò port, `lsof`, `ps`, và các tệp probe được ghi vào workspace rồi lại được dọn đi.

**Nguyên nhân gốc** — một *skill* bảo vậy. Checklist Orbit ghi *“App boots: `bun run dev` shows no
startup errors”*. Một cảnh báo thêm vào system prompt không thay đổi được gì; sửa skill thì có.

**Cách sửa** — checklist giờ trỏ tới `validate_project`; cả hai skill đi kèm đều có thêm một mục
verification; `run_command` trả advisory với những lệnh giống server.

**Kết quả** — bước 1 từ chỗ không bao giờ hoàn tất thành hoàn tất trong 65 lời gọi tool.

## 2. Một lời gọi tool fail vì timeout vượt trần

**Hiện tượng** — `run_command` với `timeoutMs` trên 600 000 trả về `INVALID_TOOL_ARGUMENTS`;
lệnh không bao giờ chạy và một lượt của model bị mất.

**Cách sửa** — giá trị vượt maximum của schema bị clamp về trần và việc điều chỉnh được báo
trong kết quả. Giá trị dưới minimum, hoặc sai kiểu, vẫn fail.

## 3. Một lần sửa README vô hiệu hoá mọi validation

**Hiện tượng** — gate từ chối hoàn thành với `WORKSPACE_EVIDENCE_STALE` cho các validation của
những package không ai đụng tới.

**Nguyên nhân gốc** — việc kiểm tra độ cũ so sánh một fingerprint duy nhất cho toàn workspace, và
mọi `project.validate` đều được ghi với `scope: workspace` kể cả khi nó chạy trong một subproject.

**Cách sửa** — độ cũ của validation được giới hạn theo đúng những đường dẫn mà validation đã bao
phủ; ghi tài liệu và đường dẫn đã xoá được miễn; drift ngoài luồng vẫn vô hiệu hoá mọi thứ. Một
ngày chạy đã từng chứa hai mươi mốt lần buộc phải validate lại.

## 4. Một run fail sau khi công việc đã xong

**Hiện tượng** — `AI Coder reached maxTurns=48` ngay sau khi kết quả tool cuối cùng nói
“Project validation passed”, với mười một validation đã được ghi.

**Cách sửa** — chạm ngân sách lượt thì được cấp một lượt finalization không tool; gate quyết định
dựa trên bằng chứng đang có. CLI cũng phơi ra `--max-turns` và `--run-minutes`, những giới hạn
trước đây vô hình.

## 5. Cache hit của provider sụp xuống 40%

**Hiện tượng** — 1,4M input token bị tính phí lại trong một run; mức tái sử dụng cache kẹt ở
~10,7k token trong khi context vượt quá 60k.

**Nguyên nhân gốc** — trạng thái run thay đổi được là thứ đầu tiên thay đổi ở 38 trong 40 lượt,
và nó nằm gần đầu request.

**Cách sửa** — khối đó được dời xuống sau prefix ổn định; fingerprint theo từng item mỗi lượt
được thêm vào để lần thoái hoá sau có thể được chỉ tên từ log. Đo được: 40% → 61%.

## 6. Gate đòi validation cho một tệp đã bị xoá

**Hiện tượng** — một file nháp được ghi rồi xoá trong cùng một bước vẫn sinh ra các item
`WRITE_NOT_VALIDATED`, buộc phải validate lại một cách vô nghĩa.

**Cách sửa** — một đường dẫn có trạng thái cuối là bị xoá thì không cần validation.

## 7. Những run ba tiếng chết vì hạ tầng

**Hiện tượng** — một sự cố DNS (`ENOTFOUND`) giết một run ở bước 6; một bước security chạm
deadline của host ở lượt 73 trong khi các sửa đổi vẫn đang được ghi; một sự cố khác làm cạn ba
lần retry của bước *kế tiếp*.

**Cách sửa** — flow harness retry lỗi transport và việc hết deadline với một ngân sách mới,
resume từ bất kỳ bước nào, có thể bị giới hạn trong một khoảng, và luôn ghi report (kèm `fatal`,
`resumedFrom`, `stoppedAfter`, `retriedSteps`). Cả hai bước từng bị giết sau đó đều hoàn tất:
198 và 150 lời gọi tool, không có lần gate từ chối nào.

## Những gì *không phải* là bug

Ghi lại để không ai phải điều tra lại:

- **Bị người dùng huỷ** — một bước kết thúc là `cancelled` với lý do được log là một tín hiệu
  bên ngoài. Flow vẫn tiếp tục; bước đó được chạy lại. (Một lần sau đó là một tool-call
  interrupt giết cả process group — một artifact của harness, đã sửa bằng cách khởi chạy run
  detached.)
- **Guard dependency từ chối** — agent thử grep source thư viện; guard từ chối và giờ nói rõ
  việc đọc nào *được* phép. Hoạt động đúng như thiết kế.
- **Chặn no-progress** — cùng một lời gọi hai lần. Hoạt động đúng như thiết kế.
- **Số token trôi giữa các lượt** — bộ ước lượng tự hiệu chỉnh theo usage của provider.
  Fingerprint nội dung, không phải con số, cho bạn biết cái gì đã thay đổi.

## Một câu hỏi còn mở mà chúng tôi chọn không che lấp

Bước `s13-connect-api` của flow kỳ vọng agent tham khảo catalogue component của Galaxy UI. Bước
này nối một trang có sẵn vào API: nó không cài component nào, và nó hoàn tất đúng cách bằng
những component mà một bước trước đã cài. Kỳ vọng này có vẻ quá nghiêm ngặt cho bước đó — nhưng
nới lỏng flow để một run trông xanh sẽ phá hỏng chính mục đích của việc đặt kỳ vọng. Nó vẫn
được ghi lại ở đây cho tới khi tác giả của flow quyết định.
