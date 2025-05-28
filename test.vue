<template>
    <div>
      <div class="fixed-info">
        <p>当前可视区域内包含 "test" 的元素 (Vue):</p>
        <ul v-if="visibleTestElements.length > 0">
          <li v-for="elData in visibleTestElements" :key="elData.id || elData.uniqueKey">
            ID: {{ elData.id || 'N/A' }}, Classes: {{ elData.className }}
          </li>
        </ul>
        <p v-else>无</p>
      </div>
  
      <!-- 你的页面内容，可能包含 test 元素 -->
      <div style="height: 300px; border: 1px dashed red; margin: 10px; padding: 5px;">
        <p>容器1</p>
        <div class="item test-class-vue" id="v_item1" style="height: 100px; background: lightblue; margin: 5px;">Vue Item 1 (test-class-vue)</div>
        <div class="item another-test-vue" id="v_item2" style="height: 100px; background: lightcoral; margin: 5px;">Vue Item 2 (another-test-vue)</div>
      </div>
  
      <div v-if="showMoreItems" style="height: 300px; border: 1px dashed green; margin: 10px; padding: 5px;">
        <p>动态容器</p>
        <div class="item test-dynamic" id="v_item_dyn1" style="height: 100px; background: lightgoldenrodyellow; margin: 5px;">Dynamic Test Item</div>
      </div>
       <button @click="toggleMoreItems">Toggle Dynamic Items</button>
  
      <div style="height: 800px; background: #eee; display: flex; align-items: center; justify-content: center;">Scroll down...</div>
       <div class="item test-far-away" id="v_item_far" style="height: 100px; background: lightseagreen; margin: 5px;">Far Away Test Item</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  
  const visibleTestElements = ref([]); // 存储可见的 test 元素信息
  let intersectionObserver = null;
  let mutationObserver = null;
  const observedByIntersection = new Set(); // 跟踪哪些元素已被 IntersectionObserver 观察
  
  // 用于给没有id的元素生成唯一key
  let uniqueKeyCounter = 0;
  
  const showMoreItems = ref(false);
  const toggleMoreItems = () => {
    showMoreItems.value = !showMoreItems.value;
    // DOM 更新后，MutationObserver 会自动触发扫描
    // 或者可以手动调用 scanAndObserveTestElements
    // nextTick(() => {
    //   scanAndObserveTestElements();
    // });
  };
  
  
  const handleIntersection = (entries) => {
    const currentVisible = new Set(visibleTestElements.value.map(item => item.el));
  
    entries.forEach(entry => {
      const elementData = {
        id: entry.target.id,
        className: entry.target.className,
        el: entry.target, // 存储元素引用以便比较
        uniqueKey: entry.target.dataset.uniqueKey // 使用 dataset 获取唯一键
      };
  
      if (entry.isIntersecting) {
        if (!currentVisible.has(entry.target)) {
          visibleTestElements.value.push(elementData);
          currentVisible.add(entry.target); // 更新 currentVisible Set
        }
      } else {
        if (currentVisible.has(entry.target)) {
          visibleTestElements.value = visibleTestElements.value.filter(e => e.el !== entry.target);
          currentVisible.delete(entry.target); // 更新 currentVisible Set
        }
      }
    });
    // console.log('Visible test elements:', visibleTestElements.value.map(e=>e.id || e.className));
  };
  
  const scanAndObserveTestElements = () => {
    // console.log('Scanning for test elements...');
    // 查找整个文档中所有类名包含 "test" 的元素
    // 在微前端中，可能需要更精确地定位根元素，例如 this.$root.$el 或特定微应用的容器
    const allTestElements = document.querySelectorAll('[class*="test"]');
    const currentElementsNodeList = Array.from(allTestElements);
  
    // 1. Unobserve elements that are no longer in the DOM or no longer match
    observedByIntersection.forEach(el => {
      if (!currentElementsNodeList.includes(el)) {
        intersectionObserver.unobserve(el);
        observedByIntersection.delete(el);
        // Also remove from visible list if it was there
        visibleTestElements.value = visibleTestElements.value.filter(e => e.el !== el);
      }
    });
  
    // 2. Observe new elements
    currentElementsNodeList.forEach(el => {
      if (!observedByIntersection.has(el)) {
        // 为没有 id 的元素分配一个唯一标识符，用于 Vue 的 key 和跟踪
        if (!el.id && !el.dataset.uniqueKey) {
          el.dataset.uniqueKey = `test-el-${uniqueKeyCounter++}`;
        }
        intersectionObserver.observe(el);
        observedByIntersection.add(el);
      }
    });
  };
  
  onMounted(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.01, // 至少1%可见
    };
    intersectionObserver = new IntersectionObserver(handleIntersection, observerOptions);
  
    // 初始扫描
    scanAndObserveTestElements();
  
    // 设置 MutationObserver 监听 DOM 变化
    // 观察整个 document.body，或者一个更具体的父容器（如果知道的话）
    // 在微前端场景下，你可能需要观察主应用中承载微应用的容器，或者微应用自身的根元素
    const targetNode = document.body; // 根据实际情况调整
    const mutationConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }; // 监听子节点增删、子树变化、class属性变化
  
    mutationObserver = new MutationObserver((mutationsList) => {
      // console.log('DOM mutation detected', mutationsList);
      // 可以进行优化，仅当添加/删除节点或 class 变化可能影响 "test" 元素时才重新扫描
      // 例如，检查 mutationsList 中是否有新增节点，或节点 class 变化后是否包含 "test"
      let needsScan = false;
      for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
              needsScan = true;
              break;
          }
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const oldClassList = mutation.oldValue || "";
              const newClassList = mutation.target.className || "";
              // 如果旧class不含test但新class含test，或者旧class含test但新class不含test
              if ((!oldClassList.includes('test') && newClassList.includes('test')) ||
                  (oldClassList.includes('test') && !newClassList.includes('test'))) {
                  needsScan = true;
                  break;
              }
          }
      }
  
      if (needsScan) {
          // 使用 nextTick 确保 DOM 更新完毕后再扫描
          nextTick(() => {
              scanAndObserveTestElements();
          });
      }
    });
  
    mutationObserver.observe(targetNode, mutationConfig);
  });
  
  onBeforeUnmount(() => {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
    observedByIntersection.clear();
    visibleTestElements.value = [];
  });
  
  </script>
  
  <style scoped>
  .fixed-info {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #333;
    color: white;
    padding: 10px;
    z-index: 1000;
    box-sizing: border-box;
    max-height: 150px;
    overflow-y: auto;
  }
  .fixed-info ul {
    list-style: none;
    padding-left: 15px;
  }
  .fixed-info li {
    font-size: 0.9em;
    margin-bottom: 3px;
  }
  /* Add other styles for .item if needed */
  body {
    padding-top: 160px; /* Make space for fixed-info */
  }
  </style>