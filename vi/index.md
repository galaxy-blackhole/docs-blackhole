---
layout: home

hero:
  name: Galaxy Blackhole
  text: AI coding kiểm chứng được
  tagline: CLI và TUI, một runtime agent dùng chung, web GUI và một hành trình giao hàng — mọi khẳng định đều có bằng chứng sinh ra ngay trong workspace của bạn.
  image:
    src: /logo.svg
    alt: Galaxy Blackhole
  actions:
    - theme: brand
      text: Bắt đầu
      link: /vi/guide/getting-started
    - theme: alt
      text: Lệnh CLI
      link: /vi/cli/
    - theme: alt
      text: Bản tiếng Anh
      link: /

features:
  - title: Bằng chứng, không phải lời nói
    details: Chỉ validate_project hoặc review diff mới sinh bằng chứng hoàn thành. Gate từ chối kết thúc nếu thiếu, và việc vô hiệu hoá được giới hạn theo đúng phạm vi đã kiểm.
  - title: Chạy được qua sự cố
    details: Flow ghi từng sự kiện ra đĩa, resume tại một bước, retry khi mạng đứt hoặc hết hạn, và luôn ghi report kể cả khi chết.
  - title: Context rẻ
    details: Trạng thái đổi-mỗi-lượt được đặt sau prefix ổn định nên mỗi lượt chỉ tính lại phần đuôi — đo được 40% → 61% cache hit.
  - title: Bộ nhớ chờ bạn xác nhận
    details: Agent đề xuất quy ước, bạn xác nhận, và khi recall thấy code lệch với điều đã nhớ thì nó báo lệch thay vì im lặng.
---

## Có gì trong này

<div class="gb-cards">
  <div class="gb-card">
    <h3><a href="/vi/cli/">CLI &amp; TUI blackhole</a></h3>
    <p>Một tác vụ, TUI tương tác, flow chạy tuần tự, skills, memory, MCP server và web GUI — <span class="gb-pill">2.0.0</span></p>
  </div>
  <div class="gb-card">
    <h3><a href="/core/">Runtime ai-coder-core</a></h3>
    <p>Engine cho mọi host: ports có kiểu, effect profile của tool, ngân sách context, checkpoint và completion gate tất định — <span class="gb-pill">0.3.0</span></p>
  </div>
  <div class="gb-card">
    <h3><a href="/web/">Web GUI &amp; hành trình</a></h3>
    <p>blackhole web mở harness đã patch với thương hiệu Galaxy; hành trình giao hàng chạy dev → CI → UAT → duyệt → prod từ một blueprint — <span class="gb-pill">alpha</span></p>
  </div>
  <div class="gb-card">
    <h3><a href="/ecosystem/versions">Hệ sinh thái</a></h3>
    <p>VS Code extension, retrieval core và bảng phiên bản mà tài liệu này được viết dựa trên</p>
  </div>
</div>

## Cài và chạy

```sh
npm i -g @galaxy-stack/blackhole-cli
blackhole chat                        # TUI tương tác
blackhole run "thêm endpoint /health" # một tác vụ, một kết quả cuối
blackhole flow flows/gymflow.json     # chuỗi prompt có kiểm chứng
```

Runtime cần Node 22.13+ và chỉ hỗ trợ ESM. Bạn cần một model provider (Ollama hoặc
endpoint tương thích OpenAI) — xem [cài đặt và cấu hình](/vi/guide/getting-started).

## Tài liệu này được kiểm chứng thế nào

[Flow 25 prompt](/guide/flow-and-e2e) là cổng release: một bản chỉ được coi là đã kiểm
khi mọi bước hoàn tất trên đúng package đã phát hành. Các lỗi đã tạo nên bản release
hiện tại — kèm bằng chứng và nguyên nhân gốc — nằm ở
[nhật ký lỗi](/reference/failure-journal).
