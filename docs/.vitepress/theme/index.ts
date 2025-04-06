import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import DocumentTabs from '../components/DocumentTabs.vue'
import './styles/custom.css'

export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 在内容区域顶部插入Tab组件
      'doc-before': () => h(DocumentTabs)
    })
  },
  enhanceApp({ app }) {
    // 注册组件
    app.component('DocumentTabs', DocumentTabs)
  }
} 