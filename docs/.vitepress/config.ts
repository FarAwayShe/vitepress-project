import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: '项目文档',
  description: '项目设计与开发文档',
  
  themeConfig: {
    // 导航菜单
    nav: [
      { text: '首页', link: '/' },
      { text: '表单', link: '/form/design' },
      { text: '表格', link: '/table/design' }
    ],

    // 侧边栏
    sidebar: {
      '/': [
        {
          text: '模板',
          items: [
            { text: '表单', link: '/form' },
            { text: '表格', link: '/table' }
          ]
        },
        // {
        //   text: '表单',
        //   items: [
        //     { text: '设计文档', link: '/form' },
        //     { text: '开发文档', link: '/form/development' }
        //   ]
        // },
        // {
        //   text: '表格',
        //   items: [
        //     { text: '设计文档', link: '/table/design' },
        //     { text: '开发文档', link: '/table/development' }
        //   ]
        // }
      ],
    }
  }
})
