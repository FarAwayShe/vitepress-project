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
  { id: 'design', label: '设计文档', suffix: 'design' },
  { id: 'development', label: '开发文档', suffix: 'development' }
]

const activeTab = ref('design')

// 判断是否应该显示tabs
const shouldDisplayTabs = computed(() => {
  const path = route.path
  // 只在表单和表格模块的文档页面显示tabs
  return path.startsWith('/form/') || path.startsWith('/table/')
})

// 根据当前路由确定激活的tab
const determineActiveTab = () => {
  const currentPath = route.path
  console.log(currentPath);
  
  if (currentPath.endsWith('design.html')) {
    activeTab.value = 'design'
  } else if (currentPath.endsWith('development.html')) {
    activeTab.value = 'development'
  }else{
    switchTab('design')
  }
}

// 切换到目标tab
const switchTab = (tabId) => {
//   if (activeTab.value === tabId) return
  const targetTab = tabs.find(tab => tab.id === tabId)
  const currentPath = route.path
  
  // 获取当前模块路径（/form/ 或 /table/）
  const modulePath = currentPath.split('/').slice(0, 3).join('/').split('.')[0]
//   console.log(modulePath);
  
  // 创建新路径
  const newPath = `${modulePath}/${targetTab.suffix}`
  
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