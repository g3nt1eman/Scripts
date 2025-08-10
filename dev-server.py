#!/usr/bin/env python3
# 简单的本地HTTP服务器，用于开发油猴脚本

import http.server
import socketserver
import os
import sys
from pathlib import Path

# 设置端口
PORT = 8081

# 获取脚本目录
SCRIPT_DIR = Path(__file__).parent

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """支持CORS的HTTP请求处理器"""
    
    def end_headers(self):
        # 添加CORS头，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # 设置正确的MIME类型
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def find_available_port(start_port=8081):
    """查找可用端口"""
    import socket
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('127.0.0.1', port))
                return port
        except OSError:
            continue
    return None

def main():
    # 切换到脚本目录
    os.chdir(SCRIPT_DIR)
    
    # 查找可用端口
    port = find_available_port(PORT)
    if not port:
        print(f"❌ 无法找到可用端口 (尝试范围: {PORT}-{PORT+99})")
        sys.exit(1)
    
    # 创建服务器
    with socketserver.TCPServer(("127.0.0.1", port), CORSHTTPRequestHandler) as httpd:
        print(f"🚀 本地开发服务器启动成功!")
        print(f"📡 服务地址: http://127.0.0.1:{port}")
        print(f"📁 服务目录: {SCRIPT_DIR}")
        print(f"🔗 模块URL示例:")
        print(f"   http://127.0.0.1:{port}/modules/sspai.js")
        print(f"   http://127.0.0.1:{port}/modules/zhibo8.js")
        print(f"   http://127.0.0.1:{port}/modules/aabook.js")
        print(f"   http://127.0.0.1:{port}/modules/ahri8.js")
        print(f"   http://127.0.0.1:{port}/modules/uaa.js")
        print(f"\n💡 使用这些URL替换开发脚本中的file://路径")
        print(f"⏹️  按 Ctrl+C 停止服务器")
        print("-" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 服务器已停止")

if __name__ == "__main__":
    main()
