# Context, ngân sách và caching

Mỗi lời gọi model đều mang một **ngân sách** và một **cách bố cục**. Sai một trong hai sẽ
hiện ra thành chi phí, độ trễ, hoặc một run âm thầm quên mất mình đang làm gì.

## Ngân sách

Context được lắp từ các item có trọng số thành một profile:

| Profile | Đặc điểm |
| --- | --- |
| `balanced` (mặc định) | Profile dùng hằng ngày cho các model context lớn |
| `conservative` | Cửa sổ nhỏ hơn, dự trữ output lớn hơn |
| `extended` | Cửa sổ rất lớn, nhiều chỗ hơn cho lịch sử |

Mỗi profile phân giải ra các ngưỡng: một điểm **tighten**, một điểm **eviction**, một điểm
**compaction** và một trần cứng. Áp lực được phân loại theo từng lượt thành `normal`,
`tighten`, `evict`, `compact` hoặc `blocked` — và run ghi lại nó, nên vấn đề context hiện ra
trước khi nó trở thành thất bại.

Khi compaction kích hoạt, runtime ghi một **checkpoint bền vững** và thay lịch sử bằng một
bản tóm tắt có giới hạn. Checkpoint cũng chính là cấu trúc dùng cho tính toàn vẹn khi resume
và phát hiện sửa đổi, nên compaction không thể làm mất dấu vết bằng chứng.

## Bố cục: vì sao trạng thái thay đổi được dời xuống cuối

Prefix cache của provider tái sử dụng đoạn prefix giống nhau dài nhất của một request. Bất cứ
thứ gì thay đổi ở gần đầu sẽ vô hiệu hoá mọi thứ phía sau nó.

Trạng thái bắt buộc của run — số lượt còn lại, các tệp đã sửa, pha, hành động kế tiếp — thay
đổi **mỗi lượt**. Trước đây nó nằm ngay sau system policy, theo thứ tự checkpoint mặc định.
Đo trên một flow thật:

| | Trước | Sau |
| --- | --- | --- |
| Item thay đổi đầu tiên | `runtime-mandatory-state` ở **38 trong 40** lượt | item context được thêm vào mới nhất |
| Mức tái sử dụng cache của provider | kẹt ở ~10,7k token trong khi context vượt quá 60k | 49k+ và còn tăng |
| Cache hit toàn run | 40% | **61%** |
| Bước đầu tiên của flow | 10% | 59–87% |

Cách sửa chỉ là một quyết định về thứ tự: khối thay đổi giờ nằm *sau* prefix ổn định (policy,
goal, checkpoint bền vững, tệp, tool, lịch sử) và ngay trước các message của lượt mới. Đó cũng
chính là lời khuyên các provider đưa ra — đặt nội dung được cache lên trước, nội dung thay đổi
xuống cuối.

## Hai thứ trông như bug nhưng không phải

**Số token trôi.** Bộ ước lượng tự hiệu chỉnh theo usage mà provider báo bằng một trung bình
động hàm mũ (0,75 cũ / 0,25 quan sát, có clamp), nên *cùng* một khối tool có thể được đếm là
7.312 token ở lượt này và 5.601 ở lượt khác. Nội dung y hệt; bộ ước lượng đang học. Hãy dùng
fingerprint bên dưới, đừng dùng con số, để quyết định xem có thứ gì thực sự thay đổi hay không.

**Tỷ lệ cache mỗi lượt dao động.** Một lần compaction hay một lần viết lại checkpoint sẽ reset
prefix một cách hợp lệ. Vì vậy report của flow hiển thị tỷ lệ **tích luỹ**, và runtime ghi
fingerprint của từng item ở mỗi lượt.

## Chẩn đoán

Mỗi lượt phát ra một diagnostic context:

```text
turn  categories { system, toolDefinitions, checkpoint, user, toolResults, … }
      pressure normal | currentInputTokens 18035 | projection …
      itemDigests [ { index, id, kind, tokens, hash }, … ]   (up to 24 items)
      toolHash    fnv1a64:28bbc94664ac8a7a
```

So sánh hai lượt liên tiếp sẽ chỉ ra đúng item mà thay đổi của nó đã reset cache — đó chính là
cách bug bố cục ở trên được tìm ra, từ log, không cần profiler. `toolHash` là thứ chứng minh
khối tool vốn y hệt nhau từng byte trong khi số token của nó cứ trôi.

## Hướng dẫn thực tế

- Run dài sẽ rẻ hơn với một system prompt ổn định: chỉ bật `--system-prompt-in-history` cho
  những model đã được kiểm chứng là chấp nhận system message trong lịch sử (CLI mặc định đi
  theo một danh sách đã kiểm chứng).
- Cứ để compaction xảy ra. Nó rẻ hơn một run dùng những lượt cuối để đọc lại các tệp mà nó
  không còn đủ chỗ chứa.
- Nếu cache hit sụp, hãy nhìn vào item *đầu tiên* có hash thay đổi; diagnostic cho bạn biết đó
  là item nào, và câu trả lời thường là một khối lẽ ra không nên nằm sớm như vậy.
