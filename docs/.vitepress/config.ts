import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: '项目文档',
  description: '项目设计与开发文档',
  
  themeConfig: {
    // 导航菜单
    nav: [
      { text: '首页', link: '/' },
      { text: '设计文档', link: '/design/' },
      { text: '开发文档', link: '/development/' }
    ],

    // 侧边栏
    sidebar: {
      '/design/': [
        {
          text: '设计文档',
          items: [
            { text: '设计概述', link: '/design/' },
            { text: '系统架构', link: '/design/architecture' }
          ]
        }
      ],
      '/development/': [
        {
          text: '开发文档',
          items: [
            { text: '开发指南', link: '/development/' },
            { text: 'API 文档', link: '/development/api' }
          ]
        }
      ]
    }
  }
})
