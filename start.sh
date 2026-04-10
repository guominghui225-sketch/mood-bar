#!/bin/bash

# Mood Bar 项目启动脚本
# 同时启动前端和后端开发服务器

echo "🍸 启动 Mood Bar 项目..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 Node.js"
    exit 1
fi

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 启动后端
echo "🚀 启动后端服务器 (端口 3002)..."
cd server
npm install 2>/dev/null || echo "⚠️  后端依赖安装失败，继续启动..."
npm run dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 3

# 启动前端
echo "🚀 启动前端开发服务器 (端口 5173)..."
cd app
npm install 2>/dev/null || echo "⚠️  前端依赖安装失败，继续启动..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ 启动完成！"
echo ""
echo "📊 服务状态："
echo "   后端：http://localhost:3002"
echo "   前端：http://localhost:5173"
echo "   后端健康检查：http://localhost:3002/health"
echo ""
echo "🛑 按 Ctrl+C 停止所有服务"

# 捕获退出信号
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# 等待用户中断
wait