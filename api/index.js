// Vercel Serverless Function for Mood Bar API
// This file wraps the Express app for deployment on Vercel

console.log('🚀 Mood Bar API Function starting...');

// 在Vercel环境中设置环境变量
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

try {
  // 尝试加载dotenv配置（如果存在）
  try {
    require('dotenv').config();
    console.log('✅ dotenv配置加载成功');
  } catch (dotenvError) {
    console.log('⚠️ dotenv未安装或配置加载失败，使用Vercel环境变量');
  }

  // 导入Express应用
  console.log('📦 导入Express应用...');
  const app = require('../server/src/server.js');
  console.log('✅ Express应用导入成功');

  // Export as Vercel serverless function handler
  module.exports = (req, res) => {
    console.log(`📨 收到请求: ${req.method} ${req.url}`);

    // 处理预检请求 - CORS中间件会处理，但这里也处理以确保快速响应
    if (req.method === 'OPTIONS') {
      console.log('✅ 处理OPTIONS预检请求');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).end();
    }

    // 简化：直接传递请求给Express应用
    // Express应用已经定义了/api前缀的路由，vercel.json中的rewrites配置会确保请求正确路由
    console.log(`🔄 直接传递请求给Express应用: ${req.method} ${req.url}`);

    return app(req, res);
  };

} catch (error) {
  console.error('❌ API函数初始化失败:', error);

  // 导出错误处理函数
  module.exports = (req, res) => {
    console.error(`❌ 处理请求时出错: ${req.method} ${req.url}`, error);
    res.status(500).json({
      success: false,
      error: 'API服务器初始化失败',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  };
}