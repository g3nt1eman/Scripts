// 疯情书库网站优化模块
window.AabookOptimizer = {
    name: '疯情书库优化',
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
        let removedCount = 0;
        
        uniqueSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (checkPreserved) {
                        const preservedClasses = this.getPreservedClasses();
                        const shouldPreserve = OptimizerUtils.shouldPreserveElement(element, preservedClasses);
                        if (!shouldPreserve) {
                            element.remove();
                            removedCount++;
                        }
                    } else {
                        element.remove();
                        removedCount++;
                    }
                });
            } catch (error) {
                OptimizerUtils.log(this.name, `选择器错误: ${selector}`, 'warn');
            }
        });
        
        return removedCount;
    },
    
    // 主要的广告移除函数
    removeAds() {
        const adSelectors = this.getAdSelectors();
        let totalRemoved = 0;
        
        // 移除各类广告
        Object.entries(adSelectors).forEach(([type, selectorGroup]) => {
            const removed = this.removeElements(selectorGroup, type === 'contentAds');
            totalRemoved += removed;
        });
        
        if (totalRemoved > 0) {
            OptimizerUtils.log(this.name, `移除了 ${totalRemoved} 个广告元素`, 'success');
        }
    },
    
    // 启动观察器监听动态内容
    startObserver() {
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
