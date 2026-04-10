const cors = require('cors');

// CORS配置中间件
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'];

    console.log(`🌐 CORS检查: origin=${origin}, allowedOrigins=${JSON.stringify(allowedOrigins)}`);

    // 允许无origin的请求（如移动应用、Postman）
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS允许: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS拒绝: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Response-Time'],
  maxAge: 86400 // 24小时
};

module.exports = cors(corsOptions);