# Flow và kiểm chứng end-to-end

Một **flow** là file JSON liệt kê các prompt phải chạy theo thứ tự, trong một session và một
workspace. Nó tồn tại vì câu "agent chạy được" cần một bài test tái lập được — và vì một
quy trình 25 bước là cách rẻ nhất để tìm ra những lỗi mà một prompt đơn lẻ không bao giờ chạm.

## File flow

```json
{
  "name": "gymflow",
  "promptPrefix": "[Galaxy E2E test harness] Môi trường headless: đừng bao giờ yêu cầu người dùng mở terminal.",
  "confirmCandidatesAfter": ["s03-memory", "s10-api-key"],
  "steps": [
    { "id": "s01-init", "prompt": "Tạo dự án GymFlow …" },
    { "id": "s02-orbit-standards", "prompt": "Làm backend chuẩn Orbit …", "expectTools": ["mcp_orbit"] },
    { "id": "s03-memory", "prompt": "Ghi nhớ quy ước dự án …", "expectTools": ["memory_remember"] }
  ]
}
```

| Trường | Ý nghĩa |
| --- | --- |
| `promptPrefix` | Ghép trước mọi prompt — hợp đồng headless nằm ở đây |
| `steps[].id` | Định danh ổn định; dùng cho `--flow-from`, `--flow-until` và report |
| `steps[].expectTools` | Tool mà bước **phải thực sự gọi**. Bước pass mà không gọi thì **không phải pass** |
| `confirmCandidatesAfter` | Các id bước mà sau đó harness xác nhận memory đã đề xuất, thay mặt người dùng |

## Chạy

```sh
blackhole flow flows/gymflow.json --workspace /tmp/e2e/workspace --state-dir /tmp/e2e/state --flow-out /tmp/e2e/out
```

Mỗi bước ghi ra:

| File | Nội dung |
| --- | --- |
| `step-NN-<id>.ndjson` | Mọi sự kiện, ghi **ngay khi xảy ra** |
| `progress.log` | Một dòng gọn, đã che secret, cho mỗi lần gọi tool, kết quả, gate từ chối, đổi trạng thái và retry |
| `flow-report.json` | Phán quyết cuối: trạng thái từng bước, kỳ vọng, số lần gate từ chối, số lỗi tool, token và cache hit tích luỹ |

Report được ghi **kể cả khi run chết**, kèm `fatal`, `resumedFrom`, `stoppedAfter`,
`skippedSteps` và `retriedSteps` — crash không bao giờ đọc thành pass, và run resume không
bao giờ nhận công những bước nó bỏ qua.

## Sống được qua thực tế

| Cờ | Dùng khi |
| --- | --- |
| `--flow-from <step-id>` | Resume tại một bước, cùng session/workspace/state |
| `--flow-until <step-id>` | Dừng sau một bước; ghép với `--flow-from` để chạy lại một khoảng |
| `--flow-step-retries <n>` | Thử lại bước chết vì **mạng đứt** hoặc **hết hạn host** trước khi coi là fail |
| `--max-turns`, `--run-minutes` | Cho bước nặng nhiều thời gian hơn mặc định |

Cả hai loại retry đều là hạ tầng, không phải lỗi tác vụ: một sự cố DNS từng giết run 3 tiếng
ở bước 6, và một bước bảo mật chạm hạn 45 phút ở lượt 73 khi các sửa đổi còn đang ghi. Retry
tiếp tục trong cùng session với ngân sách mới, và số lần thử vẫn bị chặn.

## Rà một run

```sh
node scripts/e2e-report.mjs /tmp/e2e/out
```

Script in bảng từng bước và gắn cờ những thứ mà một bước **đang pass vẫn có thể che**:

- bước không hề gọi tool mà định nghĩa của nó yêu cầu,
- file component thư viện bị viết tay mà không có lệnh scaffold,
- check toàn dự án chạy bằng shell (không sinh bằng chứng),
- server dài hạn bị bật trong run headless,
- bằng chứng được tạo trước lần write cuối,
- cùng một lời gọi lặp hai lần trong một lượt.

Kiểm tra này tồn tại vì những lỗi đắt nhất không phải crash — mà là những bước kết thúc trong
khi làm sai cách.

## Cổng release

[Flow 25 prompt GymFlow](https://github.com/galaxy-blackhole/galaxy-code/blob/main/flows/gymflow.json)
dựng một backend Orbit và một frontend React/Vite/Galaxy UI, rồi kiểm memory, bảo mật,
dashboard, xuất báo cáo và tổng kết. Một bản `x.y.z` chỉ được phát hành sau khi flow này
hoàn tất trên chính nó.

Những lỗi nó tìm ra — và cách sửa — nằm ở [nhật ký lỗi](/vi/reference/failure-journal), kể cả
những thứ **không phải** lỗi sản phẩm (một lần huỷ từ bên ngoài, một sự cố DNS) để không ai
phải điều tra lại.

Tiếp theo: [xử lý sự cố](/vi/guide/troubleshooting).
