# MCP server

Model Context Protocol cho agent thêm tool chuyên dụng — knowledge base của framework, catalog
component, review bảo mật — dưới **cùng luật bằng chứng** như tool built-in.

## Server đi kèm

Hai server first-party được cấu hình mặc định:

| Tên | Lệnh | Cung cấp |
| --- | --- | --- |
| `orbit` | `npx -y @galaxy-stack/orbit-mcp` | Knowledge topic của Orbit, nội dung scaffold module, review bảo mật |
| `nebula` | `npx -y @galaxy-stack/nebula-mcp` | Catalog component Galaxy UI, source component, tìm kiếm |

Bỏ qua bằng `--no-galaxy-mcp` (hữu ích cho run offline hoàn toàn hoặc workspace không dùng hai
framework này).

## Cấu hình server riêng

Server được khai báo trong agent config (`~/.galaxy/agent.json`, hoặc `--agent-config`):

```json
{
  "mcpServers": [
    {
      "name": "linear",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-linear"],
      "timeoutMs": 60000
    },
    {
      "name": "remote",
      "transport": "http",
      "url": "https://mcp.example.com",
      "auth": "oauth"
    }
  ]
}
```

Tối đa 16 server. Server không kết nối được sẽ được ghi log `mcp_connect_failed` và **không**
làm run dừng; chỉ là tool của nó không xuất hiện.

## Liệt kê và chẩn đoán

```sh
blackhole mcp                 # kết nối server đã cấu hình và liệt kê tool
blackhole logs 20 | grep mcp  # lỗi kết nối và sự kiện OAuth
```

Tool từ server được đặt tên theo namespace (`mcp_orbit_orbit_knowledge_read`), và model có thể
tìm thêm bằng `search_tools` thay vì đoán tên — CLI cố ý giữ bề mặt tool nhỏ để model không bị
ngập trong schema.

## OAuth cho server HTTP

```sh
blackhole mcp login remote    # mở trình duyệt, bắt callback localhost
blackhole mcp logout remote   # quên token đã lưu
```

Token lưu ở `<state-dir>/mcp-auth.json` mode 0600 và tự refresh. Flow không bao giờ thấy chúng.

## Làm việc với tài liệu MCP

Hai luật giữ cho công việc framework trung thực — cả hai đều học từ lỗi thật:

1. **Đọc trước khi viết.** Catalog component và knowledge topic là tham chiếu API có thẩm
   quyền; skill đi kèm nói rõ điều đó, và model phải tra trước khi viết code framework.
2. **Khai báo thì đọc được, source thì không.** `read_file` trên đúng một `package.json`,
   `README.md` hoặc `*.d.ts` trong `node_modules` là **được phép** và được khuyến khích khi cần
   API của version đã cài. Grep cả cây dependency — bằng file tool *hoặc* bằng trình đọc shell —
   bị từ chối và nay được trả lời kèm advisory nói rõ cách đọc nào hợp lệ.
