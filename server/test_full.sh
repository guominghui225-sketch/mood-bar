#!/bin/bash
echo "启动服务器..."
node src/server.js > server.log 2>&1 &
SERVER_PID=$!
echo "服务器PID: $SERVER_PID"
sleep 3

echo "测试健康检查..."
curl -s http://localhost:3006/health

echo -e "\n测试生成鸡尾酒API..."
curl -X POST http://localhost:3006/api/generate-cocktail \
  -H "Content-Type: application/json" \
  -d '{"mood": "happy"}' \
  -s | python -m json.tool

echo -e "\n服务器日志:"
cat server.log

echo -e "\n停止服务器..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
rm -f server.log
