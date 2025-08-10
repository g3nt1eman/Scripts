// ==UserScript==
// @name         多网站优化器 (本地HTTP开发版本)
// @namespace    http://tampermonkey.net/
// @version      2.1-dev-http
// @description  优化多个网站的界面显示，移除广告和不必要的元素 (本地HTTP开发版本)
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
// @require      http://127.0.0.1:8081/modules/sspai.js
// @require      http://127.0.0.1:8081/modules/zhibo8.js
// @require      http://127.0.0.1:8081/modules/aabook.js
// @require      http://127.0.0.1:8081/modules/ahri8.js
// @require      http://127.0.0.1:8081/modules/uaa.js
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    
    // 开发模式配置
    const DEV_CONFIG = {
        enableDebugLogs: true,
        enablePerformanceMonitoring: true,
        enableErrorReporting: true,
        serverUrl: 'http://127.0.0.1:8081'
    };
    
    // 调试日志函数
    function debugLog(message, ...args) {
        if (DEV_CONFIG.enableDebugLogs) {
            console.log(`[多网站优化器-HTTP开发] ${message}`, ...args);
        }
    }
    
    // 性能监控
    function performanceTimer(label) {
        if (DEV_CONFIG.enablePerformanceMonitoring) {
            console.time(`[性能] ${label}`);
            return () => console.timeEnd(`[性能] ${label}`);
        }
        return () => {};
    }
    
    // 检查开发服务器状态
    async function checkDevServer() {
        try {
            // 在HTTPS页面上请求HTTP将被视为混合内容，使用 no-cors 并将 opaque 当作“在线”处理
            const response = await fetch(DEV_CONFIG.serverUrl, { method: 'HEAD', mode: 'no-cors' });
            // response.type === 'opaque' 代表请求成功但不可读，此处视为在线
            return response.ok || response.type === 'opaque';
        } catch (error) {
            return false;
        }
    }
    
    // 网站优化器管理类
    class SiteOptimizerManager {
        constructor() {
            this.hostname = window.location.hostname;
            this.activeOptimizer = null;
            this.initStartTime = Date.now();
        }
        
        async init() {
            const endTimer = performanceTimer('优化器初始化');
            debugLog(`优化器启动 - 当前网站: ${this.hostname}`);
            
            // 检查开发服务器
            const serverOnline = await checkDevServer();
            if (!serverOnline) {
                console.warn('开发服务器未运行，请启动: python3 dev-server.py');
                this.showServerError();
            }
            
            // 检查模块是否正确加载
            if (!this.checkModulesLoaded()) {
                console.error('优化器模块未正确加载');
                this.showLoadError();
                return;
            }
            
            debugLog('所有模块已正确加载');
            
            // 根据不同网站执行相应的优化
            if (this.hostname.includes('sspai.com')) {
                this.activateOptimizer(window.SspaiOptimizer, '少数派');
            } else if (this.hostname.includes('zhibo8.com')) {
                this.activateOptimizer(window.Zhibo8Optimizer, '直播吧');
            } else if (this.hostname.includes('aabook.') || this.hostname.includes('aavbook.') || 
                      this.hostname.includes('fqbook.') || this.hostname.includes('czbook.')) {
                this.activateOptimizer(window.AabookOptimizer, '疯情书库');
            } else if (this.hostname.includes('ahri8.top')) {
                this.activateOptimizer(window.Ahri8Optimizer, '松鼠症仓库');
            } else if (this.hostname.includes('uaa.com')) {
                this.activateOptimizer(window.UaaOptimizer, 'UAA');
            } else {
                debugLog('未识别的网站，跳过优化');
            }
            
            endTimer();
            debugLog(`优化器初始化耗时: ${Date.now() - this.initStartTime}ms`);
        }
        
        checkModulesLoaded() {
            const modules = {
                'SspaiOptimizer': window.SspaiOptimizer,
                'Zhibo8Optimizer': window.Zhibo8Optimizer,
                'AabookOptimizer': window.AabookOptimizer,
                'Ahri8Optimizer': window.Ahri8Optimizer,
                'UaaOptimizer': window.UaaOptimizer
            };
            
            for (const [name, module] of Object.entries(modules)) {
                if (!module) {
                    console.error(`模块 ${name} 未加载`);
                    return false;
                }
                debugLog(`模块 ${name} 加载成功`);
            }
            
            return true;
        }
        
        activateOptimizer(optimizer, siteName) {
            if (optimizer && typeof optimizer.init === 'function') {
                const endTimer = performanceTimer(`${siteName}优化器激活`);
                
                this.activeOptimizer = optimizer;
                try {
                    optimizer.init();
                    debugLog(`已激活优化器: ${optimizer.name}${optimizer.version ? ` v${optimizer.version}` : ''}`);
                    
                    // 在开发模式下，为优化器添加调试信息
                    if (DEV_CONFIG.enableDebugLogs) {
                        this.addDevInfo(siteName);
                    }
                } catch (error) {
                    console.error(`激活优化器时出错:`, error);
                }
                
                endTimer();
            } else {
                console.error('优化器模块格式不正确或初始化函数缺失');
            }
        }
        
        // 显示服务器错误提示
        showServerError() {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b35;
                color: white;
                padding: 12px 16px;
                border-radius: 6px;
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
                max-width: 320px;
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
            `;
            errorDiv.innerHTML = `
                <strong>🚨 开发服务器未运行</strong><br><br>
                请在终端中启动开发服务器：<br>
                <code style="background: rgba(255,255,255,0.2); padding: 2px 4px; border-radius: 3px;">
                cd /Users/test/Sync/ChromeExtensions/Scripts<br>
                python3 dev-server.py
                </code><br><br>
                <small>服务器地址: ${DEV_CONFIG.serverUrl}</small>
            `;
            
            document.body.appendChild(errorDiv);
            
            // 10秒后自动移除
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 10000);
        }
        
        // 显示加载错误提示
        showLoadError() {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
                max-width: 300px;
            `;
            errorDiv.innerHTML = `
                <strong>模块加载失败</strong><br>
                请检查开发服务器是否正常运行<br>
                模块URL: <code>${DEV_CONFIG.serverUrl}/modules/</code>
            `;
            
            document.body.appendChild(errorDiv);
            
            // 5秒后自动移除
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
        
        // 添加开发信息显示
        addDevInfo(siteName) {
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.85);
                color: #00ff88;
                padding: 10px 14px;
                border-radius: 6px;
                z-index: 10000;
                font-family: monospace;
                font-size: 11px;
                cursor: pointer;
                border: 1px solid #00ff88;
                box-shadow: 0 2px 8px rgba(0, 255, 136, 0.2);
            `;
            infoDiv.innerHTML = `
                <strong>🔧 HTTP开发模式</strong><br>
                网站: ${siteName}<br>
                优化器: 已激活<br>
                版本: ${(this.activeOptimizer && this.activeOptimizer.version) ? this.activeOptimizer.version : 'n/a'}<br>
                服务器: ${DEV_CONFIG.serverUrl}<br>
                <small style="opacity: 0.7;">点击隐藏</small>
            `;
            
            infoDiv.onclick = () => {
                if (infoDiv.parentNode) {
                    infoDiv.parentNode.removeChild(infoDiv);
                }
            };
            
            document.body.appendChild(infoDiv);
            
            // 15秒后自动半透明
            setTimeout(() => {
                if (infoDiv.parentNode) {
                    infoDiv.style.opacity = '0.4';
                }
            }, 15000);
        }
        
        cleanup() {
            if (this.activeOptimizer && typeof this.activeOptimizer.destroy === 'function') {
                this.activeOptimizer.destroy();
                debugLog('优化器已清理');
            }
        }
    }
    
    // 创建优化器管理实例
    const optimizerManager = new SiteOptimizerManager();
    
    // 等待页面加载完成后执行优化
    async function initOptimizer() {
        try {
            await optimizerManager.init();
        } catch (error) {
            console.error('优化器初始化失败:', error);
            if (DEV_CONFIG.enableErrorReporting) {
                // 在开发模式下显示详细错误信息
                console.error('详细错误信息:', error.stack);
            }
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
    
    // 开发模式下的全局调试对象
    if (DEV_CONFIG.enableDebugLogs) {
        window.OptimizerDebug = {
            manager: optimizerManager,
            config: DEV_CONFIG,
            reloadOptimizer: async () => {
                optimizerManager.cleanup();
                await initOptimizer();
            },
            getActiveOptimizer: () => optimizerManager.activeOptimizer,
            toggleDebugMode: () => {
                DEV_CONFIG.enableDebugLogs = !DEV_CONFIG.enableDebugLogs;
                console.log(`调试模式: ${DEV_CONFIG.enableDebugLogs ? '开启' : '关闭'}`);
            },
            checkServer: async () => {
                const online = await checkDevServer();
                console.log(`开发服务器状态: ${online ? '在线' : '离线'}`);
                return online;
            },
            testModuleLoad: async () => {
                try {
                    const response = await fetch(`${DEV_CONFIG.serverUrl}/modules/sspai.js`, { mode: 'no-cors' });
                    const ok = response.ok || response.type === 'opaque';
                    console.log('模块加载测试:', ok ? '成功' : '失败');
                    return ok;
                } catch (error) {
                    console.error('模块加载测试失败:', error);
                    return false;
                }
            }
        };
        
        debugLog('HTTP开发调试对象已挂载到 window.OptimizerDebug');
        debugLog(`开发服务器地址: ${DEV_CONFIG.serverUrl}`);
    }
    
})();
