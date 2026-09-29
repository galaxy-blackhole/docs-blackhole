# Changelog

Cả hai package đã phát hành đều giữ một changelog theo dạng
[Keep a Changelog](https://keepachangelog.com), bằng tiếng Anh, với thời gian ghi ở `+07:00`.

| Package | Changelog | Ghi chú |
| --- | --- | --- |
| `@galaxy-stack/blackhole-cli` | [galaxy-code/CHANGELOG.md](https://github.com/galaxy-blackhole/galaxy-code/blob/main/CHANGELOG.md) | Một mục cho mỗi release |
| `@galaxy-stack/ai-coder-core` | [galaxy-ai-coder-core/CHANGELOG.md](https://github.com/galaxy-blackhole/galaxy-ai-coder-core/blob/main/CHANGELOG.md) | Được biên soạn từ các fragment theo từng bản sửa vào lúc release |

## Quy ước fragment

Core ghi mọi bản sửa ở mức hành vi hoặc API thành một fragment có ngày trong `CHANGELOG.d/`
**ngay khi công việc landing**, chứ không phải vào lúc release:

```text
CHANGELOG.d/2026-09-28-thu-tu-mandatory-state-cache.md
```

Mỗi fragment ghi lại khu vực, hành vi trước và sau, và regression test — và liên kết tới sự cố
trong `galaxy-code/docs/TEST_FAILURE_ANALYSIS.md` khi bản sửa đến từ một lỗi thật. Vào lúc
release, các fragment còn tồn được biên soạn vào một mục phiên bản; mục đã biên soạn liên kết
tới từng fragment, nên các fragment ở lại trong repository thay vì bị xoá.

## Đọc một bản release

- `[2.0.0]` và `[0.3.0]` là cặp đã kiểm chứng được tài liệu trên site này mô tả.
- Bất cứ thứ gì có `-alpha.N` đều là development: nó tồn tại để một bản sửa có thể được thử, và
  nó phát hành dưới dist-tag `alpha`.
- Dấu vết theo từng bản sửa trong mục `[0.3.0]` của core là cách nhanh nhất để thấy bao nhiêu
  hành vi hiện nay đến từ những lỗi thật thay vì từ các cuộc họp thiết kế.

## Đối chiếu một phiên bản với một run

Log runtime ghi lại `packageVersion` đang được dùng. Khi bạn nghi một khiếm khuyết đã sửa đang
tái diễn, hãy đối chiếu phiên bản đó với changelog **trước khi** điều tra — vài “regression”
trong quá trình phát triển hoá ra chỉ là một run trên bản build cũ hơn.
