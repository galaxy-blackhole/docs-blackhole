# Chính sách release

## Hai dòng, một luật

| Dòng | Dạng phiên bản | Dist-tag | Phát hành khi |
| --- | --- | --- | --- |
| **Verified** | `x.y.z` | `latest` | Flow end-to-end hoàn tất trên chính nó |
| **Development** | `x.y.z-alpha.N` | `alpha` | Bất cứ khi nào nó sẵn sàng để được thử |

Vì vậy `npm install @galaxy-stack/blackhole-cli` luôn rơi vào dòng đã kiểm chứng; `@alpha` là
nơi phần đang làm dở nằm. Việc phát hành được tự động hoá qua npm trusted publishing (OIDC,
không lưu token) khi push lên `main`, và workflow sẽ bỏ qua một phiên bản mà npm đã có.

## "Verified" khẳng định điều gì

Với `2.0.0` và `0.3.0`, nó nghĩa là:

- [flow 25 prompt](/vi/guide/flow-and-e2e) hoàn tất mọi bước trên đúng các package đã phát
  hành — backend Orbit, frontend React/Vite/Galaxy UI, memory, security, dashboard, export,
  summary;
- những lỗi nổi lên trên đường đi đều được chẩn đoán, sửa, và được liệt kê trong
  [nhật ký lỗi](/vi/reference/failure-journal);
- artifact đã cài đặt đã được chạy thử (`npm i -g`, rồi một run thật), không chỉ là bản build
  cục bộ.

Nó **không** khẳng định các sản phẩm đã đủ tính năng; [bảng phiên bản](/vi/ecosystem/versions)
dán nhãn cái gì stable, alpha, prototype hay frozen.

## `1.0.0` và độ ổn định API

`1.0.0` của core được để dành cho cột mốc ổn định API. Các bản `0.y.z` vẫn có thể thay đổi hình
dạng — số 0 đứng đầu nói đúng điều đó.

## Changelog

Cả hai package đều giữ một `CHANGELOG.md` theo dạng [Keep a Changelog](https://keepachangelog.com),
bằng tiếng Anh, với thời gian ở `+07:00`. Core còn ghi thêm một fragment cho mỗi bản sửa vào
`CHANGELOG.d/` ngay khi công việc landing, rồi biên soạn các fragment còn tồn thành một mục
phiên bản vào lúc release.

Các fragment vẫn ở lại trong repository sau khi biên soạn để những liên kết bên trong mục đã
biên soạn tiếp tục phân giải được. Xem [changelog](/vi/reference/changelogs).

## Một thay đổi được đưa vào như thế nào

1. Một bản sửa landing kèm một regression test (hoặc một ghi chú tường minh nói vì sao không
   thể có test).
2. Nếu nó đến từ một lỗi thật, nó được viết thành văn bản trong
   `galaxy-code/docs/TEST_FAILURE_ANALYSIS.md` — hiện tượng, bằng chứng, nguyên nhân gốc, cách
   sửa, trạng thái.
3. Flow end-to-end được chạy lại; một bước bị thoái hoá sẽ hiện ra như một bước fail, chứ không
   phải như một báo lỗi từ người dùng.
4. Một phiên bản được cắt: changelog biên soạn, version bump, push — và CI phát hành.

## Đọc một số phiên bản

`2.0.0` (CLI) và `0.3.0` (core) là một cặp: CLI pin đúng phiên bản core mà nó đã được kiểm
chứng, và manifest đã phát hành mang pin từ registry chứ không phải một đường dẫn cục bộ. Nếu
bạn cần biết chính xác một bản CLI cụ thể nhúng gì, hãy đọc `package.json` của nó — đó là hợp
đồng.
