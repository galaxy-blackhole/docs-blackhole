import { defineConfig } from 'vitepress';

/** Production host: the Vercel project tracks this repository's `main` branch. */
const SITE_URL = 'https://galaxy-blackhole.vercel.app/';

const en = {
  label: 'English',
  lang: 'en',
  title: 'Galaxy Blackhole',
  description:
    'Galaxy Blackhole: the blackhole CLI and TUI, the ai-coder-core runtime, the web GUI and the delivery journey that ships them.',
};

const vi = {
  label: 'Tiếng Việt',
  lang: 'vi',
  link: '/vi/',
  title: 'Galaxy Blackhole',
  description:
    'Galaxy Blackhole: CLI/TUI blackhole, runtime ai-coder-core, web GUI và hành trình giao hàng (delivery journey).',
  themeConfig: {
    nav: [
      { text: 'Nhập môn', link: '/vi/guide/introduction' },
      { text: 'CLI', link: '/vi/cli/' },
      { text: 'Web & hành trình', link: '/vi/web/' },
      { text: 'Core', link: '/vi/core/' },
      { text: 'Hệ sinh thái', link: '/vi/ecosystem/versions' },
      { text: 'Tham chiếu', link: '/vi/reference/release-policy' },
    ],
    sidebar: {
      '/vi/guide/': [
        {
          text: 'Bắt đầu',
          items: [
            { text: 'Giới thiệu', link: '/vi/guide/introduction' },
            { text: 'Cài đặt và cấu hình', link: '/vi/guide/getting-started' },
            { text: 'Tham chiếu cấu hình', link: '/vi/guide/configuration' },
          ],
        },
        {
          text: 'Hằng ngày',
          items: [
            { text: 'Giao diện dòng lệnh', link: '/vi/guide/tui' },
            { text: 'Flow và kiểm chứng E2E', link: '/vi/guide/flow-and-e2e' },
            { text: 'Xử lý sự cố', link: '/vi/guide/troubleshooting' },
          ],
        },
      ],
      '/vi/cli/': [
        {
          text: 'Lệnh',
          items: [
            { text: 'Tổng quan', link: '/vi/cli/' },
            { text: 'Lệnh và cờ', link: '/vi/cli/commands' },
            { text: 'Memory', link: '/vi/cli/memory' },
            { text: 'Skills', link: '/vi/cli/skills' },
            { text: 'MCP server', link: '/vi/cli/mcp' },
            { text: 'Web GUI', link: '/vi/cli/web' },
          ],
        },
      ],
      '/vi/web/': [
        {
          text: 'Web GUI',
          items: [
            { text: 'Tổng quan', link: '/vi/web/' },
            { text: 'Hành trình giao hàng', link: '/vi/web/journey' },
          ],
        },
      ],
      '/vi/core/': [
        {
          text: 'Runtime',
          items: [
            { text: 'Kiến trúc', link: '/vi/core/' },
            { text: 'Bằng chứng và completion gate', link: '/vi/core/evidence' },
            { text: 'Context và caching', link: '/vi/core/context' },
            { text: 'Tool, guard và advisory', link: '/vi/core/tools' },
          ],
        },
      ],
      '/vi/ecosystem/': [
        {
          text: 'Hệ sinh thái',
          items: [
            { text: 'Bảng phiên bản', link: '/vi/ecosystem/versions' },
            { text: 'VS Code extension', link: '/vi/ecosystem/vscode' },
            { text: 'Retrieval core', link: '/vi/ecosystem/retrieval' },
          ],
        },
      ],
      '/vi/reference/': [
        {
          text: 'Tham chiếu',
          items: [
            { text: 'Chính sách release', link: '/vi/reference/release-policy' },
            { text: 'Nhật ký lỗi', link: '/vi/reference/failure-journal' },
            { text: 'Changelog', link: '/vi/reference/changelogs' },
          ],
        },
      ],
    },
    outline: { label: 'Trong trang', level: [2, 3] },
    docFooter: { prev: 'Trước', next: 'Sau' },
    darkModeSwitchLabel: 'Giao diện',
    sidebarMenuLabel: 'Mục lục',
    returnToTopLabel: 'Về đầu trang',
    lastUpdatedText: 'Cập nhật',
  },
};

export default defineConfig({
  cleanUrls: true,
  lastUpdated: true,
  locales: { root: en, vi },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0b0a14' }],
  ],
  sitemap: { hostname: SITE_URL },
  transformHead({ pageData }) {
    // Every page exists in both locales, so advertise the pair explicitly.
    const relative = pageData.relativePath.replace(/(?:index)?\.md$/, '');
    const shared = relative.replace(/^vi\//, '');
    const english = new URL(shared, SITE_URL).href;
    const vietnamese = new URL(`vi/${shared}`, SITE_URL).href;
    return [
      ['link', { rel: 'alternate', hreflang: 'en', href: english }],
      ['link', { rel: 'alternate', hreflang: 'vi', href: vietnamese }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: english }],
    ];
  },
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/galaxy-blackhole/docs-blackhole/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Web & journey', link: '/web/' },
      { text: 'Core', link: '/core/' },
      { text: 'Ecosystem', link: '/ecosystem/versions' },
      { text: 'Reference', link: '/reference/release-policy' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Install and configure', link: '/guide/getting-started' },
            { text: 'Configuration reference', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Day to day',
          items: [
            { text: 'Terminal UI', link: '/guide/tui' },
            { text: 'Flow runs and E2E verification', link: '/guide/flow-and-e2e' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
      ],
      '/cli/': [
        {
          text: 'Command reference',
          items: [
            { text: 'Overview', link: '/cli/' },
            { text: 'Commands and flags', link: '/cli/commands' },
            { text: 'Memory', link: '/cli/memory' },
            { text: 'Skills', link: '/cli/skills' },
            { text: 'MCP servers', link: '/cli/mcp' },
            { text: 'Web GUI', link: '/cli/web' },
          ],
        },
      ],
      '/web/': [
        {
          text: 'Web GUI',
          items: [
            { text: 'Overview', link: '/web/' },
            { text: 'Delivery journey', link: '/web/journey' },
          ],
        },
      ],
      '/core/': [
        {
          text: 'Runtime',
          items: [
            { text: 'Architecture', link: '/core/' },
            { text: 'Evidence and the completion gate', link: '/core/evidence' },
            { text: 'Context, budgets and caching', link: '/core/context' },
            { text: 'Tools, guards and advisories', link: '/core/tools' },
          ],
        },
      ],
      '/ecosystem/': [
        {
          text: 'Ecosystem',
          items: [
            { text: 'Version matrix', link: '/ecosystem/versions' },
            { text: 'VS Code extension', link: '/ecosystem/vscode' },
            { text: 'Retrieval core', link: '/ecosystem/retrieval' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Release policy', link: '/reference/release-policy' },
            { text: 'Failure journal', link: '/reference/failure-journal' },
            { text: 'Changelogs', link: '/reference/changelogs' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/galaxy-blackhole' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Galaxy Blackhole',
    },
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    docFooter: { prev: 'Previous', next: 'Next' },
  },
});
