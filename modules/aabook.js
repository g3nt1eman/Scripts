// 疯情书库网站优化模块
window.AabookOptimizer = {
    name: '疯情书库优化',
    version: '1.0.0',
    initialized: false,
    observer: null,
    
    init() {
        if (this.initialized) {
            console.log('疯情书库优化器已初始化，跳过重复初始化');
            return;
        }
        this.initialized = true;
        console.log('正在优化疯情书库网站...');
        this.removeAds();
        this.startObserver();
    },
    
    // 广告选择器配置
    getAdSelectors() {
        return {
            // 页面结构广告
            structureAds: [
                '#header',
                '#focus',
                '.focus',
                'div[class*="focus"]',
                'div[id*="focus"]',
                '.xinwengonggao',
                '#xinwengonggao',
                'div[class*="xinwen"]',
                'div[class*="gonggao"]',
                '.duzhedongtai',
                '#duzhedongtai',
                'div.tongleizuopin:nth-of-type(3)',
                'div.tongleizuopin:nth-of-type(4)',
                '.book_info > p',
                '.f63092',
                '.pinglunqu',
                '#pinglunqu',
                'div[class*="pinglun"]',
                'div[id*="pinglun"]',
                'center',
                '.navi',
                '#navi'
            ],

            // 底部广告
            footerAds: [
                '.footer',
                '#footer',
                '.footer-fixed-nav',
                '.copyright',
                '.youqinglianjie',
                'div[class*="footer"]',
                'div[id*="footer"]'
            ],

            // 内容区域广告
            contentAds: [
                'div[style*="margin"] > a[target="_blank"] > img',
                '.contact',
                'a[href*="vip.xyz"]',
                'a[href*="fkxl.xyz"]'
            ],

            // 手机版特有广告
            mobileAds: [
                // 性福宝广告块
                'div.mod.block > div.hd[boxid="heiyanMobileIndexXinshu"]',
                'div.mod.block:has(div.hd[boxid="heiyanMobileIndexXinshu"])',
                'div[class="mod block"]:has(div.hd[boxid="heiyanMobileIndexXinshu"])',

                // 其他广告选择器
                '.navi:has(.appico16)',
                '.footer-fixed-nav',
                '#o63092',
                '#o63093',
                'div[align="94%"]',
                'div[width="94%"]',
                'a[href*="vip.xyz"]',
                'a[href*="fkxl.xyz"]',
                'a[target="_blank"]:has(img[src*="webp"])',
                'a[target="_blank"]:has(img[src*="gif"])'
            ]
        };
    },
    
    // 保留的重要元素类名
    getPreservedClasses() {
        return [
            'gezhonganniu',
            'book_info_top',
            'book_info_top_r'
        ];
    },
    
    // 移除广告的核心函数
    removeElements(selectors, checkPreserved = false) {
        const uniqueSelectors = Array.from(new Set(selectors));
        const elements = document.querySelectorAll(uniqueSelectors.join(','));
        const preservedClasses = this.getPreservedClasses();
        
        elements.forEach(element => {
            if (checkPreserved) {
                // 检查是否包含需要保留的类名
                const shouldPreserve = preservedClasses.some(className =>
                    element.classList.contains(className) ||
                    element.closest(`.${className}`)
                );
                if (!shouldPreserve) {
                    element.remove();
                    console.log(`已移除疯情书库广告元素: ${element.tagName}`);
                }
            } else {
                element.remove();
                console.log(`已移除疯情书库广告元素: ${element.tagName}`);
            }
        });
    },
    
    // 主要的广告移除函数
    removeAds() {
        const adSelectors = this.getAdSelectors();
        
        // 移除各类广告
        Object.entries(adSelectors).forEach(([type, selectorGroup]) => {
            this.removeElements(selectorGroup, type === 'contentAds');
        });
    },
    
    // 启动观察器监听动态内容
    startObserver() {
        // 监听DOM变化，处理动态加载的广告（带节流）
        let scheduled = false;
        const schedule = () => {
            if (scheduled) return;
            scheduled = true;
            setTimeout(() => {
                try {
                    this.removeAds();
                } finally {
                    scheduled = false;
                }
            }, 150);
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
            console.log('疯情书库优化器已清理');
        }
        this.initialized = false;
    }
};
