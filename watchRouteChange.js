/**
 * 监听浏览器路由变化
 * @param {function} callback - 路由变化时的回调函数，接收路由信息对象
 * @returns {function} 取消监听的函数
 */
function watchRouteChange(callback) {
    // 当前路由信息对象
    const getRouteInfo = () => ({
      hash: window.location.hash,
      pathname: window.location.pathname,
      search: window.location.search,
      fullPath: window.location.pathname + window.location.search + window.location.hash
    });
  
    // 保存原始 history 方法
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
  
    // 重写 pushState 方法
    history.pushState = function(state, title, url) {
      const result = originalPushState.apply(this, arguments);
      callback(getRouteInfo());
      return result;
    };
  
    // 重写 replaceState 方法
    history.replaceState = function(state, title, url) {
      const result = originalReplaceState.apply(this, arguments);
      callback(getRouteInfo());
      return result;
    };
  
    // 路由变化处理函数
    const handleRouteChange = () => callback(getRouteInfo());
  
    // 监听事件
    window.addEventListener('popstate', handleRouteChange);  // history 变化
    window.addEventListener('hashchange', handleRouteChange); // hash 变化
  
    // 初始调用一次
    callback(getRouteInfo());
  
    // 返回取消监听函数
    return () => {
      // 恢复原始 history 方法
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      
      // 移除事件监听
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }