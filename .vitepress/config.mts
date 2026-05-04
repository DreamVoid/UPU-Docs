import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-Hans',
      title: "UPU 帮助手册",
      description: "有关 UniversalPluginUpdater 的所有东西都在这里",
      themeConfig: {
        nav: [
          { text: '主页', link: 'https://upu.dreamvoid.me' },
          { text: '文档', link: './', activeMatch: '/' },
        ],

        sidebar: [
          {
            text: '基础',
            items: [
              { text: '🏡 首页', link: './' },
              { text: '⚙️ 安装指南​', link: './setting-up' }
            ]
          },
          {
            text: '核心',
            items: [
              {
                text: '🔧 配置', link: './core/config/index.md',
                collapsed: true,
                items: [
                  { text: 'config.yml', link: './core/config/config.yml.md' },
                  { text: 'global.json<br>PluginId.json', link: './core/config/channel.json.md' },
                ]
              },
              { text: '📢 命令', link: './core/commands.md' },
              { text: '📡 远程通信', link: './core/remote-communication.md' }
            ]
          },
          {
            text: '高级',
            items: [
              { text: '🌐 本地化', link: './advanced/localization.md' },
            ]
          },
          {
            text: '开发者',
            items: [
              { text: '🏗️ 编译', link: './developer/compilation.md' },
              { text: '🎴 自定义更新', link: './more-coming' },
              { text: '🤝 贡献指南', link: './more-coming' }
            ]
          }
        ],

        editLink: {
          text: '编辑此页面'
        }
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      title: "UPU Docs",
      description: "All things about UniversalPluginUpdater are here",
      themeConfig: {
        nav: [
          { text: 'Home', link: 'https://upu.dreamvoid.me' },
          { text: 'Docs', link: './', activeMatch: '/' },
        ],

        sidebar: [
          {
            text: 'Basics',
            items: [
              { text: '🏡 Home', link: './' },
              { text: '⚙️ Setup Guide', link: './setting-up' }
            ]
          },
          {
            text: 'Core',
            items: [
              {
                text: '🔧 Configuration', link: './core/config/index',
                collapsed: true,
                items: [
                  { text: 'config.yml', link: './core/config/config.yml' },
                  { text: 'global.json<br>PluginId.json', link: './core/config/channel.json' },
                ]
              },
              { text: '📢 Commands', link: './core/commands' },
              { text: '📡 Remote Communication', link: './core/remote-communication' }
            ]
          },
          {
            text: 'Advanced',
            items: [
              { text: '🌐 Localization', link: './advanced/localization' },
            ]
          },
          {
            text: 'Developer',
            items: [
              { text: '🏗️ Build', link: './developer/compilation' },
              { text: '🎴 Custom Updates', link: './more-coming' },
              { text: '🤝 Contribution Guide', link: './more-coming' }
            ]
          }
        ],
      },
    }
  },

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/DreamVoid/UPU-Docs/edit/main/:path'
    },
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DreamVoid/UniversalPluginUpdater' },
      { icon: 'modrinth', link: 'https://modrinth.com/plugin/upu' }
    ]
  },
  
  sitemap: {
    hostname: 'https://docs.upu.dreamvoid.me'
  }
})
