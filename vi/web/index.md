# Web GUI

`blackhole web` mang cùng runtime agent đó lên trình duyệt, với thương hiệu Galaxy và
một đơn giản hoá có chủ ý: **PTC là preset agent duy nhất**.

## PTC nghĩa là gì

Thay vì phơi ra hàng chục tool cho model, preset này chỉ phơi **một** tool: `run_code`.
Model viết một chương trình ngắn dựa trên SDK được sinh ra, và chương trình đó gọi các
tool thật — `bash`, `read`, `edit`, `write`, `grep`, `subagent`, `todo_write`,
`journey_get`, `journey_set`, `journey_run`.

Hai hệ quả đáng biết:

- **Bề mặt tool luôn nhỏ.** Một danh sách schema dài là context mà model phải trả giá ở
  mọi lượt; một tool cộng tài liệu thì rẻ hơn và trên thực tế ổn định hơn.
- **Luật bằng chứng vẫn áp dụng.** Các patch Galaxy giữ nguyên completion gate và ngữ
  nghĩa validation của runtime, nên một run trên trình duyệt được đánh giá y như một run
  trong terminal.

## Khởi động

```sh
blackhole web
blackhole web doctor --json     # runtime version, patches applied, Galaxy key present
blackhole web config            # where the harness, profiles and caches live
```

GUI dùng một harness home tách biệt (ghi đè bằng `--home`), nên nó không bao giờ trộn
profile hay credential với một bản harness cài đặt khác.

## Overlay chứa những gì

| Tầng | Tệp | Mục đích |
| --- | --- | --- |
| Patches | `web/patches/gbh-web.patch.yml`, `gbh-ui.patch.yml`, `gbh-brand.patch.yml` | Định tuyến model, preset PTC, các bề mặt quản trị bị ẩn, thương hiệu ở sidebar |
| Brand | `web/brand/` | Client plugin, logo, favicon, locale tiếng Việt |
| Journey | `web/brand/lib/journey-*.js`, `web/brand/panel/journey-panel.js` | Panel hành trình giao hàng (xem [hành trình giao hàng](/vi/web/journey)) |

Patch được ghim phiên bản và kiểm chứng với một bản harness cụ thể; khi bản đó thay đổi,
overlay được kiểm chứng lại thay vì âm thầm áp lại.
`blackhole web doctor` là phép kiểm cho bạn biết mình đang ở trường hợp nào.

## Session và memory

GUI dùng chung state directory với CLI, nên session bạn bắt đầu bằng `blackhole chat`
hiện ra ở sidebar, memory viết trên trình duyệt được recall ở terminal, và một provider
key cấu hình một lần là dùng được ở cả hai.

## Trạng thái

Web GUI đang ở mức **alpha**: overlay được duy trì theo một bản harness được ghim và các
bề mặt của nó vẫn còn thay đổi. CLI và runtime là dòng đã kiểm chứng; GUI mang chính sách
dist-tag `alpha` được mô tả trong
[chính sách release](/vi/reference/release-policy).
