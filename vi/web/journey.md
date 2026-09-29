# Hành trình giao hàng

Một **hành trình** (journey) biến câu hỏi "làm sao để thứ này ra tới production?" thành
một tệp mà cả agent lẫn bạn đều đọc được: blueprint. Nó cố tình nhàm chán — node, edge,
một số revision — vì phần thú vị nằm ở chỗ mọi run đều giữ bằng chứng.

## Blueprint

`journey.json` ở workspace root:

```json
{
  "version": 1,
  "revision": 1,
  "updatedAt": "2026-09-28T09:00:00.000Z",
  "updatedBy": "human",
  "variables": {},
  "nodes": [
    { "id": "dev", "kind": "trigger", "title": "Dev xong" },
    { "id": "ci", "kind": "gate", "title": "CI xanh" },
    { "id": "uat", "kind": "action", "title": "UAT" },
    { "id": "approve", "kind": "approval", "title": "Duyệt UAT" },
    { "id": "prod", "kind": "action", "title": "PROD" },
    { "id": "notify", "kind": "notify", "title": "Thông báo" }
  ],
  "edges": [
    { "from": "dev", "to": "ci" },
    { "from": "ci", "to": "uat" },
    { "from": "uat", "to": "approve" },
    { "from": "approve", "to": "prod" },
    { "from": "prod", "to": "notify" }
  ]
}
```

| Loại node | Ý nghĩa |
| --- | --- |
| `trigger` | Điểm vào: công việc phải tồn tại trước khi hành trình có thể bắt đầu |
| `gate` | Một phép kiểm phải đạt (`ci`, một test suite, một build) |
| `action` | Công việc được chạy — kể cả lệnh shell, thực thi ở workspace root |
| `approval` | Một quyết định của con người; run dừng chờ ở đây |
| `notify` | Thông báo kết quả |

Blueprint mang một **revision**. Các thao tác ghi được kỳ vọng gửi kèm revision mà chúng
đã đọc; lệch nhau thì fail với `journey/conflict` thay vì âm thầm ghi đè chỉnh sửa của
người khác — cùng ý tưởng compare-and-swap mà các file tool dùng.

## Một run

| Bước | Điều xảy ra |
| --- | --- |
| `start` | Chốt revision của blueprint vào một run và đánh dấu các node trigger |
| `advance` | Thực thi mọi node có edge đầu vào đã thoả (`eligibleNodes`), chạy lệnh kèm timeout và ghi lại output |
| `status` / `list` | Mỗi node đang ở đâu, và những run nào đang tồn tại |
| `decide` | Trả lời một node `approval`: `approve` → done, `reject` → failed, `retry` → pending, `reset` → pending từ bất kỳ trạng thái nào |
| `cancel` | Dừng các node đang chạy và đang chờ; bằng chứng đã hoàn tất vẫn được giữ |

Trạng thái node được nêu tường minh: `pending`, `running`, `awaiting_approval`, `blocked`,
`done`, `failed`, `cancelled`. Chỉ có thể quyết định một node khi nó đang
`awaiting_approval` hoặc `blocked` — bạn không thể “approve” một thứ chưa từng yêu cầu.

Mọi quyết định đều ghi lại ai làm và vì sao (`note.by`, `note.text`, timestamp), nên lịch
sử của run là một audit trail chứ không chỉ là một trường trạng thái.

## Ai điều khiển nó

| Người điều khiển | Cách |
| --- | --- |
| Bạn, trên trình duyệt | Panel hành trình hiển thị blueprint, trạng thái node và các nút quyết định |
| Bạn, trong terminal | Cùng blueprint đó chỉ là một tệp: đọc, sửa, commit |
| Agent | `journey_get` (đọc), `journey_set` (ghi với `expectedRevision`), `journey_run` (`start`, `advance`, `status`, `list`, `decide`, `cancel`) |

Vì agent dùng đúng những tool như bạn, một hành trình có thể được model *đề xuất* — “đây là
pipeline tôi sẽ chạy, hãy duyệt nó” — rồi được thực thi với cùng luật xung đột và bằng chứng
như mọi thứ khác.

## Vì sao nó nằm trong tài liệu

Phần lớn tooling cho agent dừng lại ở pull request. Hành trình giao hàng là chỗ dấu vết bằng
chứng tiếp tục: gate nào đã chạy, ai duyệt UAT, revision nào của blueprint đang có hiệu lực.
Đó cũng chính là nguyên tắc của [completion gate](/vi/core/evidence), áp cho việc ship thay
vì việc code.
