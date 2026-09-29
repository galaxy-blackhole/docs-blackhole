# Bảng phiên bản

Tài liệu này được viết dựa trên những phiên bản nào, và mỗi thành phần được dán nhãn ra sao.

| Thành phần | Phiên bản | Trạng thái |
| --- | --- | --- |
| `@galaxy-stack/blackhole-cli` | **2.0.0** | Stable — đã kiểm chứng bằng flow 25 prompt |
| `@galaxy-stack/ai-coder-core` | **0.3.0** | Stable — kiểm chứng bằng cùng flow đó |
| Web GUI (`blackhole web`) | đi theo CLI | Alpha — overlay ghim vào một bản harness cụ thể |
| `@galaxy-stack/blackhole-gbh` | 0.1.0-alpha.1 | **Frozen** — đã được gộp vào `galaxy-code` thành `blackhole web`; giữ lại như một tham chiếu chỉ đọc |
| `galaxy-code-vscode` | 2.0.0-prototype.0 | Prototype — host VS Code cho cùng runtime đó |
| `@galaxy/retrieval-core` | 0.1.0 | Early — hợp đồng retrieval và planning |
| `docs-blackhole` (site này) | 1.0.0 | Current |

## "Stable" ở đây nghĩa là gì

Một phiên bản `x.y.z` thuần chỉ được phát hành **sau khi flow end-to-end hoàn tất trên chính
nó**. Cổng đó không phải là mong muốn suông: release note của 2.0.0 và 0.3.0 liệt kê những lỗi
mà flow tìm ra trong lúc các phiên bản này đang được chuẩn bị, và
[nhật ký lỗi](/vi/reference/failure-journal) giữ lại bằng chứng.

Phần đang làm dở luôn giữ hậu tố `-alpha.N` tường minh và phát hành dưới dist-tag `alpha`, nên
`npm install …@latest` không bao giờ rơi vào phần chưa được kiểm chứng.

## Những version pin quan trọng

| Pin | Ở đâu | Vì sao |
| --- | --- | --- |
| Bản harness cho overlay web | `galaxy-code/web/patches/gbh-web.patch.yml` | Patch được kiểm chứng với đúng một bản release; đổi bản đó thì phải kiểm chứng lại |
| `@galaxy-stack/ai-coder-core` trong CLI | `galaxy-code/package.json` | CLI phát hành với một pin từ registry, không bao giờ dùng dependency `file:` |
| Node ≥ 22.13 | cả hai package | Runtime dùng SQLite có sẵn để lưu memory và session |

## Ghi chú tương thích

- **Node 22.13+** là bắt buộc, không phải khuyến nghị.
- **Chỉ ESM.** Core không có entry point CommonJS.
- **Web GUI đi theo phiên bản CLI** nhưng overlay của nó nhắm vào một bản harness được ghim;
  `blackhole web doctor` báo cả hai, và đó là cách nhanh nhất để thấy lệch.
- **VS Code extension là một host**, không phải một bản fork: nó nhúng cùng core, nên các bản
  sửa runtime áp dụng cho nó ngay khi nó pin phiên bản core mới.
