# Xử lý sự cố

Mọi mục dưới đây đều đến từ run thật kèm bằng chứng. Nhật ký đầy đủ — kể cả những mục hoá ra
**không phải** lỗi sản phẩm — nằm ở [nhật ký lỗi](/vi/reference/failure-journal).

## Run không bao giờ kết thúc và cứ dò port

**Hiện tượng** — transcript hiện `vite --port …`, `curl`, `lsof`, kiểm tra tiến trình lặp
lại, và bước chạm hạn mà không kết luận được gì.

**Nguyên nhân** — agent cho rằng cách duy nhất chứng minh UI là có server đang chạy. Một
checklist trong skill từng nói đúng như vậy ("App boots: `bun run dev` shows no startup
errors"), và model làm theo chỉ dẫn trusted đó.

**Cách xử lý** — skill đi kèm nay nói ngược lại, và `run_command` trả advisory khi lệnh
giống server. Hãy chứng minh dự án bằng `validate_project` (`build`, `test`, `lint`,
`typecheck`); chỉ bật server khi tác vụ yêu cầu app đang chạy, và tắt trước khi validate lần
cuối.

## `AI Coder reached maxTurns=N` hoặc `run deadline exceeded`

**Nguyên nhân** — ngân sách run, không phải tác vụ. Một bước có thể chạm trần khi các sửa đổi
còn đang ghi (hoặc sau khi đã xong — gate đã thoả nhưng không còn lượt để nói ra).

**Cách xử lý** — nâng lên: `--max-turns 120 --run-minutes 45`. Runtime cũng cấp một lượt
finalization không tool khi hết lượt, nên run đã đủ bằng chứng vẫn báo cáo được thay vì fail.

## `Ollama transport failed [cause=ENOTFOUND]: fetch failed`

**Nguyên nhân** — DNS hoặc kết nối tới provider, không phải workspace.

**Cách xử lý** — flow tự retry lỗi transport (`--flow-step-retries`), và
`--flow-from <step-id>` chạy tiếp từ chỗ dừng mà không lặp lại các bước đã xong. Với một run
đơn lẻ, chỉ cần chạy lại: session, workspace và memory vẫn nguyên.

## Gate từ chối hoàn thành: `WORKSPACE_EVIDENCE_STALE`, `WRITE_NOT_VALIDATED`

**Nguyên nhân** — một file trong phạm vi đã validate bị đổi sau khi validate, hoặc một đường
dẫn đã ghi không có validation nào sau đó bao phủ nó.

**Cách xử lý** — chạy lại `validate_project` cho đúng project bạn vừa sửa. Những thứ **không**
cần: ghi tài liệu (`.md`, `docs/`, LICENSE), và đường dẫn đã bị xoá (file nháp không thể
validate khi nó không còn). Drift ngoài luồng — ai đó sửa file ngoài tầm nhìn của agent — vô
hiệu hoá mọi validation, và đó là chủ ý.

## `DEPENDENCY_GUARD`: không đọc được bên trong `node_modules`

**Nguyên nhân** — agent thử đọc source thư viện (bằng file tool, hoặc bằng trình đọc shell mà
advisory đã nêu tên).

**Cách xử lý** — đọc đúng một `package.json`, `README.md` hoặc `*.d.ts` cụ thể trong package
(được phép và rẻ), hoặc dùng MCP knowledge + skill đi kèm: `orbit-framework` cho Orbit,
`galaxy-ui` cho Galaxy UI.

## `Repeated tool call blocked by deterministic no-progress policy`

**Nguyên nhân** — cùng một lời gọi, cùng tham số, hai lần, mà trạng thái không đổi; hoặc nội
dung workspace quay lại hash cũ.

**Cách xử lý** — đổi cách làm: đọc lại đúng vùng hiện tại của file, dùng toàn bộ nội dung hiện
tại cho một lần write cả file, hoặc xem một nguồn khác. Episode no-progress thứ hai sẽ **pause**
run và hỏi bạn hướng đi thay vì đốt hết ngân sách.

## Secret xuất hiện trong log hoặc diff

**Nguyên nhân** — khoá bị đặt trong workspace, nơi chính diff review của agent sẽ phơi ra, hoặc
bị dán vào prompt.

**Cách xử lý** — giữ khoá trong `~/.galaxy/config.json` (0600) hoặc secret manager. Log có che
các dạng secret phổ biến trước khi ghi, nhưng che là lưới an toàn, không phải chính sách.

## Khi bí, nhìn vào đâu

| Nơi | Cho bạn biết |
| --- | --- |
| `blackhole logs 20` | Các dòng runtime mới nhất, kể cả lỗi tool kèm stack |
| `<state-dir>/logs/cli-<ngày>.ndjson` | Toàn bộ trace: chuyển trạng thái run, retry model, lỗi MCP, quyết định gate |
| `<state-dir>/runs/*/checkpoint.json` | Trạng thái run bền vững: bằng chứng, validation, hành động kế tiếp |
| `flow-report.json` + `progress.log` | Với flow: bước nào fail, và nó đã làm gì trong những phút trước đó |
