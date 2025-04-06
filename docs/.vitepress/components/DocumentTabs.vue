<template>
  <div class="document-tabs" v-if="shouldDisplayTabs">
    <div class="tab-container">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useData, useRoute } from 'vitepress'

const router = useRouter()
const route = useRoute()
const { page } = useData()

// Tab定义
const tabs = [
  { id: 'design', label: '设计文档', baseRoute: '/design/' },
  { id: 'development', label: '开发文档', baseRoute: '/development/' }
]

// 文档对照表，用于在不同类型文档间建立映射关系
const docMappings = {
  // 设计文档和开发文档的对照关系
  'architecture': 'api', // 设计文档中的架构对应开发文档中的API
  'api': 'architecture', // 开发文档中的API对应设计文档中的架构
  // 可以添加更多映射关系
}

const activeTab = ref('design')

// 判断是否应该显示tabs
const shouldDisplayTabs = computed(() => {
  const path = route.path
  // 只在文档页面显示tabs，不在首页显示
  return path.startsWith('/design/') || path.startsWith('/development/')
})

// 根据当前路由确定激活的tab
const determineActiveTab = () => {
  const currentPath = route.path
  for (const tab of tabs) {
    if (currentPath.startsWith(tab.baseRoute)) {
      activeTab.value = tab.id
      return
    }
  }
  // 默认为设计文档
  activeTab.value = 'design'
}

// 获取路径的最后一部分（文档名）
const getDocName = (path) => {
  // 如果是目录路径（以/结尾），则返回空字符串
  if (path.endsWith('/')) return ''
  // 否则获取最后一段
  const parts = path.split('/')
  return parts[parts.length - 1]
}

// 切换到目标tab
const switchTab = (tabId) => {
  if (activeTab.value === tabId) return
  
  const targetTab = tabs.find(tab => tab.id === tabId)
  const currentPath = route.path
  const currentTabBaseRoute = tabs.find(tab => tab.id === activeTab.value)?.baseRoute
  
  // 创建新路径
  let newPath = targetTab.baseRoute
  if (currentPath.startsWith(currentTabBaseRoute)) {
    // 获取当前文档名
    const currentDocName = getDocName(currentPath)
    
    if (currentDocName) {
      // 检查是否有对应的映射关系
      const mappedDocName = docMappings[currentDocName]
      
      if (mappedDocName) {
        // 使用映射的文档名
        newPath = `${targetTab.baseRoute}${mappedDocName}`
      } else {
        // 尝试使用相同的文档名
        newPath = `${targetTab.baseRoute}${currentDocName}`
      }
    }
  }
  
  activeTab.value = tabId
  // 使用正确的导航方法
  window.location.href = newPath
}

onMounted(() => {
  determineActiveTab()
})

// 监听路由变化
watch(() => route.path, () => {
  determineActiveTab()
})
</script>

<style scoped>
.document-tabs {
  padding: 10px 24px;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 16px;
}

.tab-container {
  display: flex;
  gap: 8px;
}

.tab-button {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-button:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.tab-button.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}
</style> 