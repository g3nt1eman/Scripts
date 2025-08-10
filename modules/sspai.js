// 少数派网站优化模块
window.SspaiOptimizer = {
    name: '少数派优化',
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
    },
    
    addStyles() {
        const css = `
            /* 隐藏所有导航相关元素 */
            .ss__custom__header,
            .ss__custom__header__wrapper,
            .home_tabs_wrapper,
            .home_tabs,
            .main-banner-box,
            .minor-banner-box,
            .indexRight,
            .right-side,
            .article-side,
            .related-read-box,
            .ss__custom__footer {
                display: none !important;
            }

            /* 重置页面布局 */
            .app_home#app {
                --h-ssCustomHeader: 0 !important;
                --footer_height: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                background: var(--B0-t) !important;
            }

            /* 优化内容区域 */
            .contain-box,
            .article-wrapper {
                max-width: 1000px !important;
                margin: 20px auto !important;
                padding: 0 16px !important;
            }

            /* 调整文章内容宽度 */
            .contain_content,
            .article-content {
                margin: 0 auto !important;
                max-width: none !important;
                width: 100% !important;
            }

            /* 移除多余的间距和背景 */
            .home-page .contain-box .home_tabs.home_tabs_fixed::after,
            .home-page .contain-box::before {
                display: none !important;
            }
        `;
        
        OptimizerUtils.injectStyles(css, 'sspai-optimizer-styles');
        OptimizerUtils.log(this.name, '样式注入完成', 'success');
    },
    destroy() {
        this.initialized = false;
        OptimizerUtils.log(this.name, '优化器已清理', 'success');
    }
};
