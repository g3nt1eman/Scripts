// UAA网站优化模块
window.UaaOptimizer = {
    name: 'UAA优化',
    version: '1.1.0',
    initialized: false,
    
    init() {
        if (this.initialized) {
            OptimizerUtils.log(this.name, '已初始化，跳过重复初始化', 'warn');
            return;
        }
        this.initialized = true;
        OptimizerUtils.log(this.name, '开始优化网站');
        this.addStyles();
        this.removeAds();
        this.setupObserver();
    },
    
    addStyles() {
        const css = `
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
        `;
        
        OptimizerUtils.injectStyles(css, 'uaa-optimizer-styles');
        OptimizerUtils.log(this.name, '样式注入完成', 'success');
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
        
        const removedCount = OptimizerUtils.removeElementsBySelectors(adSelectors);
        if (removedCount > 0) {
            OptimizerUtils.log(this.name, `移除了 ${removedCount} 个广告元素`, 'success');
        }
    },
    
    setupObserver() {
        // 使用通用工具创建观察器
        this.observer = OptimizerUtils.createMutationObserver(() => {
            this.removeAds();
        });
        
        OptimizerUtils.log(this.name, '已启动DOM观察器');
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.initialized = false;
        OptimizerUtils.log(this.name, '优化器已清理', 'success');
    }
};
