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

    // 添加CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
      console.log('✅ 处理OPTIONS预检请求');
      return res.status(200).end();
    }

    // 传递请求给Express应用
    console.log(`🔄 转发请求给Express应用:`);
    console.log(`  - 原始URL: ${req.url}`);
    console.log(`  - 路径: ${req.path}`);
    console.log(`  - 原始路径: ${req.originalUrl || req.url}`);
    console.log(`  - 方法: ${req.method}`);
    console.log(`  - 头信息:`, req.headers);

    // Vercel函数中，当请求/api/health时，req.url可能是/health
    // 我们需要确保Express应用能看到正确的路径
    // 保存原始URL以供参考
    const originalUrl = req.originalUrl || req.url;
    console.log(`  - 处理前原始URL: ${originalUrl}`);

    // 如果路径不以/api开头，添加/api前缀
    // 但注意：我们不需要修改req对象，因为Express应用已经定义了/api前缀的路由
    // 实际上，问题可能是Express应用期望/health但路由是/api/health
    // 我们需要模拟请求路径，使其匹配Express路由

    // 创建修改后的请求对象副本
    const modifiedReq = {
      ...req,
      // 如果原始URL以/api开头，保持原样；否则添加/api前缀
      url: originalUrl.startsWith('/api') ? originalUrl : `/api${originalUrl}`,
      originalUrl: originalUrl
    };

    console.log(`  - 修改后URL: ${modifiedReq.url}`);
    console.log(`  - 修改后原始URL: ${modifiedReq.originalUrl}`);

    return app(modifiedReq, res);
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