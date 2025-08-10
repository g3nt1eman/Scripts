// 通用工具函数模块
window.OptimizerUtils = {
    version: '1.0.0',
    
    // 统一的节流函数
    createThrottledFunction(fn, delay = 150) {
        let scheduled = false;
        return function(...args) {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                try {
                    fn.apply(this, args);
                } finally {
                    scheduled = false;
                }
            });
        };
    },
    
    // 统一的延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // 统一的元素移除函数
    removeElementsBySelectors(selectors, context = document) {
        const uniqueSelectors = Array.from(new Set(selectors));
        let removedCount = 0;
        
        uniqueSelectors.forEach(selector => {
            try {
                const elements = context.querySelectorAll(selector);
                elements.forEach(element => {
                    element.remove();
                    removedCount++;
                });
            } catch (error) {
                console.warn(`选择器错误: ${selector}`, error);
            }
        });
        
        return removedCount;
    },
    
    // 统一的样式注入函数
    injectStyles(css, id = null) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            if (id) style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        }
    },
    
    // 统一的观察器创建函数
    createMutationObserver(callback, options = {}) {
        const defaultOptions = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'id']
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        const throttledCallback = this.createThrottledFunction(callback);
        
        const observer = new MutationObserver(throttledCallback);
        observer.observe(document.body, finalOptions);
        
        return observer;
    },
    
    // 统一的日志函数
    log(moduleName, message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${moduleName}]`;
        
        switch (level) {
            case 'error':
                console.error(`${prefix} ❌ ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ⚠️ ${message}`);
                break;
            case 'success':
                console.log(`${prefix} ✅ ${message}`);
                break;
            default:
                console.log(`${prefix} ℹ️ ${message}`);
        }
    },
    
    // 清理全局变量的安全函数
    cleanGlobalVariables(varNames) {
        varNames.forEach(varName => {
            try {
                if (window[varName] !== undefined) {
                    window[varName] = undefined;
                    delete window[varName];
                }
            } catch (error) {
                console.warn(`无法清理全局变量: ${varName}`, error);
            }
        });
    },
    
    // 检查元素是否应该保留
    shouldPreserveElement(element, preservedClasses = []) {
        return preservedClasses.some(className => 
            element.classList.contains(className) || 
            element.closest(`.${className}`)
        );
    }
};
