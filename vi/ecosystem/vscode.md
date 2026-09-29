# VS Code extension

**Galaxy Blackhole for VS Code** (`galaxy-code-vscode`, hiện tại `2.0.0-prototype.0`) là một
host cho đúng runtime mà CLI nhúng vào: chat ở sidebar, adapter cho workspace và command,
approval, storage — và không gì khác. Vòng lặp agent, lắp ghép context, tool registry,
checkpoint và completion gate đều nằm trong [`@galaxy-stack/ai-coder-core`](/vi/core/).

## Lệnh

| Lệnh | Tác dụng |
| --- | --- |
| `galaxy-code.openChat` | Mở bề mặt chat |
| `galaxy-code.newThread` | Bắt đầu một thread mới |
| `galaxy-code.openWeb` | Mở web GUI thay thế |

Một view ở sidebar (`galaxy-code-sidebar`) chứa các thread và trạng thái của run hiện tại.

## Nó thừa hưởng những gì

Vì là một host chứ không phải một bản fork, mọi bảo đảm của runtime đều đúng trong editor:

- cùng **luật bằng chứng** — một thay đổi chỉ xong khi validation và diff review nói vậy,
  không phải khi model nói vậy;
- cùng các **guard** — bảo vệ đường dẫn dependency, chính sách no-progress, clamp tham số;
- cùng **memory** — ghi chú đã confirm trong CLI được recall trong editor, vì chúng dùng chung
  state directory.

## Trạng thái

Prototype: danh tính trên marketplace đã chốt (item ID `kevinbui.galaxy-code-vscode`, tên hiển
thị *Galaxy Blackhole*) và bề mặt này dùng được, nhưng hãy coi nó như một bản xem trước của câu
chuyện host hơn là một sản phẩm hoàn chỉnh. Dòng đã kiểm chứng để dùng hằng ngày là
[CLI](/vi/cli/).
