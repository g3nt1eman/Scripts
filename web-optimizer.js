// ==UserScript==
// @name         多网站优化器 (纯模块化版本)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  优化多个网站的界面显示，移除广告和不必要的元素 (纯模块化架构，无内联代码)
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
// @require      https://raw.githubusercontent.com/g3nt1eman/Scripts/refs/heads/main/modules/common-utils.js
// @require      https://raw.githubusercontent.com/g3nt1eman/Scripts/refs/heads/main/modules/sspai.js
// @require      https://raw.githubusercontent.com/g3nt1eman/Scripts/refs/heads/main/modules/zhibo8.js
// @require      https://raw.githubusercontent.com/g3nt1eman/Scripts/refs/heads/main/modules/aabook.js
// @require      https://raw.githubusercontent.com/g3nt1eman/Scripts/refs/heads/main/modules/ahri8.js
// @require      https://raw.githubusercontent.com/g3nt1eman/Scripts/refs/heads/main/modules/uaa.js
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
            
            // 直接检查模块是否已加载（@require已预加载）
            if (!this.checkModulesLoaded()) {
                console.error('优化器模块未正确加载，请检查@require配置');
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
                OptimizerUtils: window.OptimizerUtils,
                SspaiOptimizer: window.SspaiOptimizer,
                Zhibo8Optimizer: window.Zhibo8Optimizer,
                AabookOptimizer: window.AabookOptimizer,
                Ahri8Optimizer: window.Ahri8Optimizer,
                UaaOptimizer: window.UaaOptimizer,
            };
            for (const [name, mod] of Object.entries(modules)) {
                if (!mod) {
                    return false;
                }
            }
            return true;
        }
        
        // 等待模块加载完成（带重试机制）
        async waitForModules(maxRetries = 5, retryDelay = 500) {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                if (this.checkModulesLoaded()) {
                    console.log(`模块加载成功 (尝试 ${attempt}/${maxRetries})`);
                    return true;
                }
                
                if (attempt < maxRetries) {
                    console.log(`模块未就绪，${retryDelay}ms后重试... (${attempt}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryDelay *= 1.5; // 指数退避
                } else {
                    console.error('模块加载失败，已达到最大重试次数');
                }
            }
            return false;
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

        

        
        cleanup() {
            if (this.activeOptimizer && typeof this.activeOptimizer.destroy === 'function') {
                this.activeOptimizer.destroy();
                console.log('优化器已清理');
            }
        }
    }
    
    // 创建优化器管理实例
    const optimizerManager = new SiteOptimizerManager();
    
    // 初始化优化器
    function initOptimizer() {
        try {
            optimizerManager.init();
        } catch (error) {
            console.error('优化器初始化失败:', error);
        }
    }
    
    // 立即执行优化，不等待DOM加载
    initOptimizer();
    
    // 同时监听DOM变化，确保动态内容也被处理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM加载完成，重新检查优化');
            // 可以在这里添加额外的检查逻辑
        });
    }
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        optimizerManager.cleanup();
    });
    
})();
