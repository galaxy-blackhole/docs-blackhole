# Skills

**Skill** là tài liệu mà agent coi như chỉ dẫn đáng tin cho một lĩnh vực cụ thể. Galaxy
Blackhole phát hành kèm hai skill, và cài thêm được từ marketplace có ký.

## Skill đi kèm

| Skill | Bao phủ |
| --- | --- |
| `orbit-framework` | Orbit (Bun, phong cách NestJS): module, controller, service, validate bằng Zod, GraphQL, testing, tiền tố route và versioning |
| `galaxy-ui` | Galaxy UI (Nebula): catalog component, CLI `nebula`, Tailwind và design token |

Chúng nằm trong package CLI và được **tự kích hoạt khi tác vụ cần rõ ràng** — prompt về backend
Orbit sẽ nạp `orbit-framework`, prompt về component UI sẽ nạp `galaxy-ui`. Transcript hiện
việc kích hoạt này.

## Thứ tự tìm kiếm

Skill được resolve từ bốn nơi, gần nhất thắng:

| Tầng | Vị trí |
| --- | --- |
| Bundled | Trong package CLI đã cài |
| Managed | `--skills-dir <dir>`, hoặc `<state-dir>/skills` cho bản cài từ marketplace |
| User | `~/.agents/skills` |
| Workspace | `<workspace>/.agents/skills` |

Tầng cuối là cách một repository mang theo quy ước của chính nó: commit skill vào
`.agents/skills` là mọi run trong repo đó đều đọc.

## Lệnh

```sh
blackhole skills                       # skill đã cài
blackhole skills show galaxy-ui        # nội dung một skill
blackhole skills search "table"        # tìm trong index đã cấu hình
blackhole skills install acme/deploy --skill-version "^1.2.0"
blackhole skills update
blackhole skills remove acme/deploy
```

## Marketplace và chữ ký

```sh
blackhole skills install acme/deploy \
  --skills-index https://skills.example.com/index.json \
  --skills-public-key ~/.galaxy/skills-index.pem
```

- Index là URL hoặc đường dẫn local; bản cài nằm ở tầng managed.
- Có public key thì chữ ký index được xác minh trước khi cài bất cứ thứ gì, và
  `--skill-version` nhận semver range để một lần update không lặng lẽ nhảy major.
- Bản cài từ marketplace không bao giờ ghi đè skill đi kèm.

## Vì sao skill quan trọng hơn vẻ ngoài của nó

Skill là khác biệt giữa agent đoán API và agent làm theo API. Hai ví dụ từ chính nhật ký lỗi
của dự án:

- Một dòng checklist — *"App boots: `bun run dev` shows no startup errors"* — khiến agent bật
  dev server, dò port và để lại file nháp cho tới khi một bước chạm hạn. Sửa **skill** đổi được
  hành vi; cảnh báo trong system prompt thì không.
- Một skill ghi rõ *"Orbit không có `app.setGlobalPrefix`; tiền tố nằm ở `@Controller`"* đã
  chấm dứt việc agent đi tìm một API NestJS không tồn tại.

Nếu bạn làm framework, hãy viết skill trước khi viết prompt engineering.
