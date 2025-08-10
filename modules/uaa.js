// UAA网站优化模块
window.UaaOptimizer = {
    name: 'UAA优化',
    version: '1.0.0',
    initialized: false,
    
    init() {
        if (this.initialized) {
            console.log('UAA优化器已初始化，跳过重复初始化');
            return;
        }
        this.initialized = true;
        console.log('正在优化UAA网站...');
        this.addStyles();
        this.removeAds();
        this.setupObserver();
    },
    
    addStyles() {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(`
                /* 隐藏banner轮播图 */
                .banner_box {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
                
                /* 隐藏其他可能的广告元素 */
                .ad_box,
                .advertisement,
                .ads,
                [class*="banner"],
                [id*="banner"],
                [class*="ad-"],
                [id*="ad-"] {
                    display: none !important;
                }
                
                /* 优化页面布局 */
                .content_box {
                    margin-top: 0 !important;
                    padding-top: 10px !important;
                }
            `);
        } else {
            // 如果GM_addStyle不可用，使用原生方法
            const style = document.createElement('style');
            style.textContent = `
                /* UAA网站优化样式 */
                .banner_box {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
                
                .ad_box,
                .advertisement,
                .ads,
                [class*="banner"],
                [id*="banner"],
                [class*="ad-"],
                [id*="ad-"] {
                    display: none !important;
                }
                
                .content_box {
                    margin-top: 0 !important;
                    padding-top: 10px !important;
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    removeAds() {
        // 移除banner_box及相关广告元素
        const adSelectors = [
            '.banner_box',
            '.ad_box',
            '.advertisement',
            '.ads',
            '[class*="banner"]',
            '[id*="banner"]',
            '[class*="ad-"]',
            '[id*="ad-"]',
            'ins[class*="ads"]',
            'ins[data-ad]',
            'iframe[src*="googleads"]',
            'iframe[src*="doubleclick"]'
        ];
        
        Array.from(new Set(adSelectors)).forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });
    },
    
    setupObserver() {
        // 监听DOM变化，动态移除新添加的广告元素（带节流）
        let scheduled = false;
        const schedule = () => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                try { this.removeAds(); } finally { scheduled = false; }
            });
        };

        const observer = new MutationObserver(schedule);
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'id']
        });
        
        this.observer = observer;
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            console.log('UAA优化器已清理');
        }
        this.initialized = false;
    }
};
