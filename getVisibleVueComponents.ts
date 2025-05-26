/*
 * 函数：获取当前页面上可视区域内的 Vue 组件实例
 * 原理：遍历 root 实例的所有子组件，检查其根元素是否在视口内
 */

/**
 * 判断元素是否在视口中
 * @param {Element} el - DOM 元素
 * @return {boolean}
 */
function isInViewport(el) {
    if (!el || el.nodeType !== 1) return false;
    const rect = el.getBoundingClientRect();
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.right > 0 && rect.top < viewHeight && rect.left < viewWidth;
  }
  
  /**
   * 递归遍历组件实例，找出可视的组件
   * @param {Vue} instance - 当前 Vue 实例
   * @param {Array<Vue>} visibleList - 存储可视组件实例的数组
   */
  function traverse(instance, visibleList) {
    if (instance && instance.$el && isInViewport(instance.$el)) {
      visibleList.push(instance);
    }
    if (instance.$children && instance.$children.length) {
      instance.$children.forEach(child => traverse(child, visibleList));
    }
  }
  
  /**
   * 获取当前页面上可视区域的 Vue 组件实例列表
   * @param {Vue} [rootInstance] - Vue 根实例，默认为 this.$root
   * @return {Array<Vue>} 可视组件实例数组
   */
  export function getVisibleVueComponents(rootInstance) {
    const root = rootInstance || (typeof this !== 'undefined' && this.$root) || null;
    if (!root) {
      console.warn('请传入 Vue 根实例或在组件内部调用');
      return [];
    }
    const visibleList = [];
    traverse(root, visibleList);
    return visibleList;
  }
  
  // 使用示例：
  // 在任意 Vue 组件内调用：
  // import { getVisibleVueComponents } from '@/utils/visibility';
  // const visibles = getVisibleVueComponents();
  // console.log('可视组件列表：', visibles);