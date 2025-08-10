// 少数派网站优化模块
window.SspaiOptimizer = {
    name: '少数派优化',
    version: '1.0.0',
    initialized: false,
    
    init() {
        if (this.initialized) {
            console.log('少数派优化器已初始化，跳过重复初始化');
            return;
        }
        this.initialized = true;
        console.log('正在优化少数派网站...');
        this.addStyles();
    },
    
    addStyles() {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(`
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
            `);
        } else {
            // 如果GM_addStyle不可用，使用原生方法
            const style = document.createElement('style');
            style.textContent = `
                /* 少数派优化样式 */
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
                
                .app_home#app {
                    --h-ssCustomHeader: 0 !important;
                    --footer_height: 0 !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    background: var(--B0-t) !important;
                }
                
                .contain-box,
                .article-wrapper {
                    max-width: 1000px !important;
                    margin: 20px auto !important;
                    padding: 0 16px !important;
                }
                
                .contain_content,
                .article-content {
                    margin: 0 auto !important;
                    max-width: none !important;
                    width: 100% !important;
                }
                
                .home-page .contain-box .home_tabs.home_tabs_fixed::after,
                .home-page .contain-box::before {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    },
    destroy() {
        this.initialized = false;
        console.log('少数派优化器已清理');
    }
};
