// 直播吧广告移除模块
window.Zhibo8Optimizer = {
    name: '直播吧优化',
    version: '1.0.0',
    initialized: false,
    observer: null,
    
    init() {
        if (this.initialized) {
            console.log('直播吧优化器已初始化，跳过重复初始化');
            return;
        }
        this.initialized = true;
        console.log('正在优化直播吧网站...');
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
        
        // 移除匹配的元素
        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
                console.log(`已移除广告元素: ${selector}`);
            });
        });
    },
    
    startObserver() {
        // 监听动态加载的广告（带节流）
        let scheduled = false;
        const schedule = () => {
            if (scheduled) return;
            scheduled = true;
            setTimeout(() => {
                try { this.removeAds(); } finally { scheduled = false; }
            }, 120);
        };

        this.observer = new MutationObserver(schedule);
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
            console.log('直播吧优化器已清理');
        }
        this.initialized = false;
    }
};
