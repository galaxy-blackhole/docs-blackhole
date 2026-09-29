import { defineConfig } from 'vitepress';

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
      { text: 'Nhập môn', link: '/vi/guide/getting-started' },
      { text: 'Lệnh CLI', link: '/vi/cli/' },
      { text: 'English', link: '/' },
    ],
    sidebar: {
      '/vi/guide/': [
        {
          text: 'Nhập môn',
          items: [
            { text: 'Giới thiệu', link: '/vi/' },
            { text: 'Cài đặt và cấu hình', link: '/vi/guide/getting-started' },
            { text: 'Giao diện dòng lệnh', link: '/vi/guide/tui' },
          ],
        },
      ],
      '/vi/cli/': [
        {
          text: 'Lệnh',
          items: [{ text: 'Tổng quan', link: '/vi/cli/' }],
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
  sitemap: { hostname: 'https://docs-blackhole.vercel.app' },
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
