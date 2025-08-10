// 直播吧广告移除模块
window.Zhibo8Optimizer = {
    name: '直播吧优化',
    version: '1.1.0',
    initialized: false,
    observer: null,
    
    init() {
        if (this.initialized) {
            OptimizerUtils.log(this.name, '已初始化，跳过重复初始化', 'warn');
            return;
        }
        this.initialized = true;
        OptimizerUtils.log(this.name, '开始优化网站');
        this.removeAds();
        this.startObserver();
    },
    
    removeAds() {
        // 广告选择器
        const adSelectors = [
            // 百度广告
            'iframe[src*="cpro.baidustatic.com"]',
            'iframe[src*="pos.baidu.com"]',
            '[id^="_"][id*="i35"]',
            
            // 匹配动态生成的广告容器
            '[class^="_"][class*="i3"]',
            
            // 需要移除的内容区块
            '.lanqiu-news.vct-box',
            '.lanqiu-video.vct-box',
            '.zuqiu-video.vct-box',
            '.qrcode',
            '.vct-right'
        ];
        
        const removedCount = OptimizerUtils.removeElementsBySelectors(adSelectors);
        if (removedCount > 0) {
            OptimizerUtils.log(this.name, `移除了 ${removedCount} 个广告元素`, 'success');
        }
    },
    
    startObserver() {
        // 使用通用工具创建观察器
        this.observer = OptimizerUtils.createMutationObserver(() => {
            this.removeAds();
        }, {
            childList: true,
            subtree: true,
            attributes: false // 直播吧主要是DOM结构变化
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
