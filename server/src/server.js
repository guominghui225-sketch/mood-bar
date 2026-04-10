require('dotenv').config();
console.log('📁 环境文件路径:', require('path').resolve(process.cwd(), '.env'));
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const apiRouter = require('./routes/api');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;
console.log(`🔧 服务器端口配置: ${PORT} (环境变量 PORT=${process.env.PORT})`);

// 解析JSON请求体
app.use(express.json());

// 配置CORS（使用自定义中间件）
app.use(corsMiddleware);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mood Bar API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API路由
app.use('/api', apiRouter);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Mood Bar API Server started on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];
  console.log(`🌐 CORS origins: ${corsOrigins.join(', ')}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;