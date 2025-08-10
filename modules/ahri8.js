// 松鼠症仓库网站优化模块
window.Ahri8Optimizer = {
    name: '松鼠症仓库优化',
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
        this.injectStyles();
        this.injectVideoStyles();
        this.removeAds();
        this.removeVideos();
        this.cleanGlobalVars();
        this.startObserver();
        this.setupLinkHandler();
        this.scheduleDelayedCleanup();
    },
    
    // 广告选择器配置
    getAdSelectors() {
        return {
            // 广告容器
            containers: [
                '.v-top.h-right.exo-ipp-container',
                '.float-banner-footer',
                '#1x1_container',
                'div[style*="728px"][style*="90px"]',
                'div[style*="width:728px"][style*="height:90px"]',
                '.float-banner-footer-ad',
                '#fload_banner_btn'
            ],
            
            // 广告插入点
            insertions: [
                // 通用广告插入点
                'ins[class*="eas"]', 'ins[class*="ads"]', 'ins[class*="adv"]', 'ins[class*="banner"]',
                // 特定ID的广告
                'ins[id*="ads"]', 'ins[id*="ad-"]', 'ins[id*="-ad"]',
                // 数字ID的广告
                'ins[id*="774"]', 'ins[id*="606"]', 'ins[id*="862"]', 'ins[id*="343"]', 'ins[id*="407"]',
                // 尺寸相关的广告
                'ins[data-width="728"]', 'ins[data-width="300"]', 'ins[data-height="90"]', 'ins[data-height="250"]',
                // 通用属性
                'ins[data-ad]', 'ins[data-adunit]', 'ins[data-adsbytrafficstars]', 'ins[data-adzone]',
                // 广告容器
                'div[style*="width:728px"][style*="height:90px"]', 'div[style*="width:300px"][style*="height:250px"]',
                // 特定广告服务商
                'ins[data-provider*="juicy"]', 'ins[data-provider*="exo"]', 'ins[data-provider*="mag"]',
                // 其他可能的广告标记
                'ins[data-type="ad"]', 'ins[data-zoneid]', 'ins[data-adzoneid]', 'ins[data-adtype]'
            ],
            
            // 广告脚本
            scripts: [
                'script[src*="exosrv.com"]', 'script[src*="juicyads.com"]', 'script[src*="jads.co"]',
                'script[src*="magsrv.com"]', 'script[src*="ad-provider.js"]', 'script[src*="ads.js"]',
                'script[src*="adserver.juicyads.com"]', 'script[src*="poweredby.jads.co"]'
            ],
            
            // 广告框架
            frames: [
                'iframe[src*="exosrv.com"]', 'iframe[src*="syndication.exosrv.com"]', 'iframe[src*="juicyads.com"]'
            ]
        };
    },
    
    // 注入广告屏蔽样式
    injectStyles() {
        const adSelectors = this.getAdSelectors();
        const styleSheet = `
            /* 广告容器 */
            ${adSelectors.containers.join(',\n')} {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                min-height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: hidden !important;
                pointer-events: none !important;
            }
            
            /* 广告插入点 */
            ${adSelectors.insertions.join(',\n')} {
                display: none !important;
            }
            
            /* 广告框架 */
            ${adSelectors.frames.join(',\n')} {
                display: none !important;
            }
        `;

        OptimizerUtils.injectStyles(styleSheet, 'ahri8-ad-blocker-styles');
        OptimizerUtils.log(this.name, '广告屏蔽样式注入完成', 'success');
    },
    
    // 注入视频过滤样式
    injectVideoStyles() {
        const videoFilterCSS = `
            /* 视频过滤 */
            div[id^="ads-group-"]:has(.ribbon-left.ribbon-blue),
            div[id^="ads-group-"]:has(a[href*="route="]),
            div[id^="ads-group-"]:has(img[data-src*="jp.netcdn.space"]),
            div.col-lg-12 > .row {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        `;
        
        OptimizerUtils.injectStyles(videoFilterCSS, 'ahri8-video-filter-styles');
        OptimizerUtils.log(this.name, '视频过滤样式注入完成', 'success');
    },
    
    // 清理广告脚本
    cleanAdScripts() {
        const adSelectors = this.getAdSelectors();
        Array.from(new Set(adSelectors.scripts)).forEach(selector => {
            document.querySelectorAll(selector).forEach(script => {
                script.remove();
                console.log(`已移除松鼠症仓库广告脚本: ${script.src}`);
            });
        });
    },
    
    // 清理全局变量
    cleanGlobalVars() {
        const varsToClean = ['popMagic', 'ExoLoader', 'AdProvider', 'adsbyjuicy'];
        OptimizerUtils.cleanGlobalVariables(varsToClean);
        OptimizerUtils.log(this.name, '全局广告变量清理完成', 'success');
    },
    
    // 移除广告元素
    removeAds() {
        const adSelectors = this.getAdSelectors();
        
        // 移除容器
        Array.from(new Set(adSelectors.containers)).forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
                console.log(`已移除松鼠症仓库广告容器: ${selector}`);
            });
        });
        
        // 移除插入点
        Array.from(new Set(adSelectors.insertions)).forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
                console.log(`已移除松鼠症仓库广告插入点: ${selector}`);
            });
        });
        
        // 移除框架
        Array.from(new Set(adSelectors.frames)).forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
                console.log(`已移除松鼠症仓库广告框架: ${selector}`);
            });
        });
        
        this.cleanAdScripts();
    },
    
    // 移除视频内容
    removeVideos() {
        // 通过标签匹配
        document.querySelectorAll('.ribbon-left.ribbon-blue').forEach(ribbon => {
            const galleryItem = ribbon.closest('div[id^="ads-group-"]');
            if (galleryItem) {
                galleryItem.remove();
                console.log('已移除松鼠症仓库视频内容（标签匹配）');
            }
        });

        // 通过链接匹配
        document.querySelectorAll('a[href*="route=video/jav/video"]').forEach(link => {
            const galleryItem = link.closest('div[id^="ads-group-"]');
            if (galleryItem) {
                galleryItem.remove();
                console.log('已移除松鼠症仓库视频内容（链接匹配）');
            }
        });

        // 通过图片源匹配
        document.querySelectorAll('img[data-src*="jp.netcdn.space"]').forEach(img => {
            const galleryItem = img.closest('div[id^="ads-group-"]');
            if (galleryItem) {
                galleryItem.remove();
                console.log('已移除松鼠症仓库视频内容（图片匹配）');
            }
        });

        // 移除 col-lg-12 > row
        document.querySelectorAll('div.col-lg-12 > .row').forEach(row => {
            row.remove();
            console.log('已移除松鼠症仓库额外行元素');
        });
    },
    
    // 处理链接打开
    handleLinkOpen(event) {
        const target = event.target.closest('a');
        if (target && target.href) {
            event.preventDefault(); // 阻止默认行为
            window.open(target.href, '_blank'); // 在新标签页打开链接
        }
    },
    
    // 设置链接处理器
    setupLinkHandler() {
        // 绑定this上下文，确保可以正确移除
        this.boundHandleLinkOpen = this.handleLinkOpen.bind(this);
        document.body.addEventListener('click', this.boundHandleLinkOpen);
        console.log('已设置松鼠症仓库链接处理器');
    },
    
    // 启动观察器监听动态内容
    startObserver() {
        // 使用通用工具创建观察器
        this.observer = OptimizerUtils.createMutationObserver(() => {
            this.removeAds();
            this.removeVideos();
            this.cleanGlobalVars();
        });
        
        OptimizerUtils.log(this.name, '已启动DOM观察器');
    },
    
    // 安排延迟清理
    scheduleDelayedCleanup() {
        // 使用单个延迟任务，避免重复执行
        this.delayedCleanupTimer = setTimeout(() => {
            this.removeVideos();
            // 再次延迟检查，确保动态内容被清理
            this.delayedCleanupTimer = setTimeout(() => {
                this.removeVideos();
                this.delayedCleanupTimer = null;
            }, 1000);
        }, 1000);
        console.log('已安排松鼠症仓库延迟清理任务');
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        // 移除事件监听器
        if (this.boundHandleLinkOpen) {
            document.body.removeEventListener('click', this.boundHandleLinkOpen);
            this.boundHandleLinkOpen = null;
        }
        
        // 清理延迟任务定时器
        if (this.delayedCleanupTimer) {
            clearTimeout(this.delayedCleanupTimer);
            this.delayedCleanupTimer = null;
        }
        
        console.log('松鼠症仓库优化器已清理');
        this.initialized = false;
    }
};
