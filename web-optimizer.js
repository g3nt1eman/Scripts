// ==UserScript==
// @name         多网站优化器 (CDN模块化版本)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  优化多个网站的界面显示，移除广告和不必要的元素 (使用CDN模块化架构)
// @author       You
// @match        https://sspai.com/*
// @match        *://*.zhibo8.com/*
// @match        *://*.aabook.xyz/*
// @match        *://*.aavbook.cc/*
// @match        *://*.fqbook.cc/*
// @match        *://*.czbook.xyz/*
// @match        *://*.aabook.cc/*
// @match        *://*.aabook.cyou/*
// @match        *://*.ahri8.top/*
// @match        *://*.uaa.com/*
// @require      https://gist.githubusercontent.com/miangit/4b4ff0e70f417416698db47fd3ee8511/raw/sspai.js
// @require      https://gist.githubusercontent.com/miangit/c5a359c55a6d1fee4fe67bba56a808d9/raw/zhibo8.js
// @require      https://gist.githubusercontent.com/miangit/67f7acc87c1b84b44d771e55440dce07/raw/aabook.js
// @require      https://gist.githubusercontent.com/miangit/a14a939537d954560333609e42e68d11/raw/ahri8.js
// @require      https://gist.githubusercontent.com/miangit/e984367e59bdf951f7d41baf5155e883/raw/uaa.js
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    
    // 网站优化器管理类
    class SiteOptimizerManager {
        constructor() {
            this.hostname = window.location.hostname;
            this.activeOptimizer = null;
        }
        
        init() {
            console.log(`多网站优化器启动 - 当前网站: ${this.hostname}`);
            
            // 检查模块是否正确加载
            if (!this.checkModulesLoaded()) {
                console.error('优化器模块未正确加载，尝试回退到内联模式');
                this.fallbackMode();
                return;
            }
            
            // 根据不同网站执行相应的优化
            if (this.hostname.includes('sspai.com')) {
                this.activateOptimizer(window.SspaiOptimizer);
            } else if (this.hostname.includes('zhibo8.com')) {
                this.activateOptimizer(window.Zhibo8Optimizer);
            } else if (this.hostname.includes('aabook.') || this.hostname.includes('aavbook.') || 
                      this.hostname.includes('fqbook.') || this.hostname.includes('czbook.')) {
                this.activateOptimizer(window.AabookOptimizer);
            } else if (this.hostname.includes('ahri8.top')) {
                this.activateOptimizer(window.Ahri8Optimizer);
            } else if (this.hostname.includes('uaa.com')) {
                this.activateOptimizer(window.UaaOptimizer);
            } else {
                console.log('未识别的网站，跳过优化');
            }
        }
        
        checkModulesLoaded() {
            const modules = {
                SspaiOptimizer: window.SspaiOptimizer,
                Zhibo8Optimizer: window.Zhibo8Optimizer,
                AabookOptimizer: window.AabookOptimizer,
                Ahri8Optimizer: window.Ahri8Optimizer,
                UaaOptimizer: window.UaaOptimizer,
            };
            for (const [name, mod] of Object.entries(modules)) {
                if (!mod) {
                    console.error(`模块未加载: ${name}`);
                    return false;
                }
            }
            return true;
        }
        
        activateOptimizer(optimizer) {
            if (optimizer && typeof optimizer.init === 'function') {
                this.activeOptimizer = optimizer;
                optimizer.init();
                console.log(`已激活优化器: ${optimizer.name}`);
            } else {
                console.error('优化器模块加载失败或格式不正确');
            }
        }
        
        // 回退模式：如果外部模块加载失败，使用内联代码
        fallbackMode() {
            console.log('启用回退模式...');
            
            if (this.hostname.includes('sspai.com')) {
                this.inlineSspaiOptimizer();
            } else if (this.hostname.includes('zhibo8.com')) {
                this.inlineZhibo8Optimizer();
            } else if (this.hostname.includes('aabook.') || this.hostname.includes('aavbook.') || 
                      this.hostname.includes('fqbook.') || this.hostname.includes('czbook.')) {
                this.inlineAabookOptimizer();
            } else if (this.hostname.includes('ahri8.top')) {
                this.inlineAhri8Optimizer();
            } else if (this.hostname.includes('uaa.com')) {
                this.inlineUaaOptimizer();
            }
        }
        
        inlineSspaiOptimizer() {
            console.log('正在优化少数派网站 (内联模式)...');
            GM_addStyle(`
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
            `);
        }
        
        inlineZhibo8Optimizer() {
            console.log('正在优化直播吧网站 (内联模式)...');
            
            // 轻量节流，避免频繁触发
            let lastRun = 0;
            const removeAds = () => {
                const now = Date.now();
                if (now - lastRun < 200) return;
                lastRun = now;
                const adSelectors = [
                    'iframe[src*="cpro.baidustatic.com"]',
                    'iframe[src*="pos.baidu.com"]',
                    '[id^="_"][id*="i35"]',
                    '[class^="_"][class*="i3"]',
                    '.lanqiu-news.vct-box',
                    '.lanqiu-video.vct-box',
                    '.zuqiu-video.vct-box',
                    '.qrcode',
                    '.vct-right'
                ];
                
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => element.remove());
                });
            };
            
            removeAds();
            
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            this.activeOptimizer = { destroy: () => observer.disconnect() };
        }
        
        inlineAabookOptimizer() {
            console.log('正在优化疯情书库网站 (内联模式)...');
            
            let lastRun = 0;
            const removeAds = () => {
                const now = Date.now();
                if (now - lastRun < 200) return;
                lastRun = now;
                const adSelectors = [
                    // 页面结构广告
                    '#header', '#focus', '.focus', 'div[class*="focus"]', 'div[id*="focus"]',
                    '.xinwengonggao', '#xinwengonggao', 'div[class*="xinwen"]', 'div[class*="gonggao"]',
                    '.duzhedongtai', '#duzhedongtai', 'div.tongleizuopin:nth-of-type(3)', 'div.tongleizuopin:nth-of-type(4)',
                    '.book_info > p', '.f63092', '.pinglunqu', '#pinglunqu', 'div[class*="pinglun"]', 'div[id*="pinglun"]',
                    'center', '.navi', '#navi',
                    
                    // 底部广告
                    '.footer', '#footer', '.footer-fixed-nav', '.copyright', '.youqinglianjie',
                    'div[class*="footer"]', 'div[id*="footer"]',
                    
                    // 内容区域广告
                    'div[style*="margin"] > a[target="_blank"] > img', '.contact',
                    'a[href*="vip.xyz"]', 'a[href*="fkxl.xyz"]',
                    
                    // 手机版特有广告
                    'div.mod.block > div.hd[boxid="heiyanMobileIndexXinshu"]',
                    'div.mod.block:has(div.hd[boxid="heiyanMobileIndexXinshu"])',
                    'div[class="mod block"]:has(div.hd[boxid="heiyanMobileIndexXinshu"])',
                    '.navi:has(.appico16)', '.footer-fixed-nav', '#o63092', '#o63093',
                    'div[align="94%"]', 'div[width="94%"]',
                    'a[target="_blank"]:has(img[src*="webp"])', 'a[target="_blank"]:has(img[src*="gif"])'
                ];
                
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => element.remove());
                });
            };
            
            removeAds();
            
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            this.activeOptimizer = { destroy: () => observer.disconnect() };
        }
        
        inlineAhri8Optimizer() {
            console.log('正在优化松鼠症仓库网站 (内联模式)...');
            
            // 注入样式
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(`
                    /* 广告容器 */
                    .v-top.h-right.exo-ipp-container,
                    .float-banner-footer,
                    #1x1_container,
                    div[style*="728px"][style*="90px"],
                    div[style*="width:728px"][style*="height:90px"],
                    .float-banner-footer-ad,
                    #fload_banner_btn,
                    /* 广告插入点 */
                    ins[class*="eas"], ins[class*="ads"], ins[class*="adv"], ins[class*="banner"],
                    ins[id*="ads"], ins[id*="ad-"], ins[id*="-ad"],
                    ins[data-ad], ins[data-adunit], ins[data-adsbytrafficstars], ins[data-adzone],
                    /* 广告框架 */
                    iframe[src*="exosrv.com"], iframe[src*="syndication.exosrv.com"], iframe[src*="juicyads.com"],
                    /* 视频过滤 */
                    div[id^="ads-group-"]:has(.ribbon-left.ribbon-blue),
                    div[id^="ads-group-"]:has(a[href*="route="]),
                    div[id^="ads-group-"]:has(img[data-src*="jp.netcdn.space"]),
                    div.col-lg-12 > .row {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }
                `);
            }
            
            let lastRun = 0;
            const removeAds = () => {
                const now = Date.now();
                if (now - lastRun < 200) return;
                lastRun = now;
                // 移除广告元素
                const adSelectors = [
                    '.v-top.h-right.exo-ipp-container', '.float-banner-footer', '#1x1_container',
                    'div[style*="728px"][style*="90px"]', 'div[style*="width:728px"][style*="height:90px"]',
                    '.float-banner-footer-ad', '#fload_banner_btn',
                    'ins[class*="eas"]', 'ins[class*="ads"]', 'ins[class*="adv"]', 'ins[class*="banner"]',
                    'ins[id*="ads"]', 'ins[id*="ad-"]', 'ins[id*="-ad"]',
                    'ins[data-ad]', 'ins[data-adunit]', 'ins[data-adsbytrafficstars]', 'ins[data-adzone]',
                    'iframe[src*="exosrv.com"]', 'iframe[src*="syndication.exosrv.com"]', 'iframe[src*="juicyads.com"]',
                    'script[src*="exosrv.com"]', 'script[src*="juicyads.com"]', 'script[src*="jads.co"]'
                ];
                
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => element.remove());
                });
                
                // 移除视频内容
                document.querySelectorAll('.ribbon-left.ribbon-blue').forEach(ribbon => {
                    const galleryItem = ribbon.closest('div[id^="ads-group-"]');
                    if (galleryItem) galleryItem.remove();
                });
                
                document.querySelectorAll('a[href*="route=video/jav/video"]').forEach(link => {
                    const galleryItem = link.closest('div[id^="ads-group-"]');
                    if (galleryItem) galleryItem.remove();
                });
                
                document.querySelectorAll('div.col-lg-12 > .row').forEach(row => row.remove());
                
                // 清理全局变量
                const varsToClean = ['popMagic', 'ExoLoader', 'AdProvider', 'adsbyjuicy'];
                varsToClean.forEach(varName => {
                    if (window[varName]) window[varName] = undefined;
                });
            };
            
            removeAds();
            
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'id']
            });
            
            // 设置链接处理器
            document.body.addEventListener('click', (event) => {
                const target = event.target.closest('a');
                if (target && target.href) {
                    event.preventDefault();
                    window.open(target.href, '_blank');
                }
            });
            
            this.activeOptimizer = { destroy: () => observer.disconnect() };
        }
        
        inlineUaaOptimizer() {
            console.log('正在优化UAA网站 (内联模式)...');
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
            
            const removeAds = () => {
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
                
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        element.remove();
                    });
                });
            };
            
            removeAds();
            
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'id']
            });
            
            this.activeOptimizer = { destroy: () => observer.disconnect() };
        }
        
        cleanup() {
            if (this.activeOptimizer && typeof this.activeOptimizer.destroy === 'function') {
                this.activeOptimizer.destroy();
                console.log('优化器已清理');
            }
        }
    }
    
    // 创建优化器管理实例
    const optimizerManager = new SiteOptimizerManager();
    
    // 等待页面加载完成后执行优化
    function initOptimizer() {
        try {
            optimizerManager.init();
        } catch (error) {
            console.error('优化器初始化失败:', error);
        }
    }
    
    // 页面加载完成后执行优化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOptimizer);
    } else {
        initOptimizer();
    }
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        optimizerManager.cleanup();
    });
    
})();
