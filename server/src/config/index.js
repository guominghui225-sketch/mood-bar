/**
 * 配置文件入口
 */

// 环境变量配置
const env = {
  // 豆包API配置
  doubaoApiKey: process.env.DOUBAO_API_KEY,
  doubaoApiUrl: process.env.DOUBAO_API_URL || 'https://api.doubao.com/v1/chat/completions',
  doubaoModel: process.env.DOUBAO_MODEL || 'deepseek-chat',

  // 可灵API配置（支持两种认证方式：JWT token或简单Bearer token）
  klingAccessKey: process.env.KLING_ACCESS_KEY,
  klingSecretKey: process.env.KLING_SECRET_KEY,
  klingApiKey: process.env.KLING_API_KEY, // 旧版简单API Key
  klingApiUrl: process.env.KLING_API_URL || 'https://api-beijing.klingai.com/v1/images/generations',
  klingAuthType: process.env.KLING_ACCESS_KEY && process.env.KLING_SECRET_KEY ? 'jwt' :
                 process.env.KLING_API_KEY ? 'bearer' : 'mock',

  // 服务器配置
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS配置
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'],

  // 缓存配置
  cacheEnabled: process.env.CACHE_ENABLED !== 'false',
  cacheTTL: parseInt(process.env.CACHE_TTL) || 3600, // 默认1小时

  // 超时配置（毫秒）- 优化版
  timeout: {
    doubao: 45000,  // 45秒（优化后，原120秒）
    kling: 30000,   // 30秒（优化后，原60秒）
    global: 60000   // 60秒（优化后，原180秒）
  }
};

// 验证必要配置
function validateConfig() {
  const required = ['doubaoApiKey'];
  const missing = required.filter(key => !env[key]);

  if (missing.length > 0) {
    throw new Error(`缺少必要的环境变量: ${missing.join(', ')}。请检查.env文件。`);
  }

  // 检查可灵配置
  if (env.klingAuthType === 'jwt') {
    if (!env.klingAccessKey || !env.klingSecretKey) {
      console.warn('⚠️ 可灵API JWT认证配置不完整，图片生成将不可用');
    } else {
      console.log('✅ 可灵API JWT认证配置完整');
    }
  } else if (env.klingAuthType === 'bearer') {
    if (!env.klingApiKey) {
      console.warn('⚠️ 可灵API Bearer token未配置，图片生成将不可用');
    } else {
      console.log('✅ 可灵API Bearer token配置完整');
    }
  } else if (env.klingAuthType === 'mock') {
    console.warn('⚠️ 可灵API使用模拟模式，图片生成将不可用');
  } else {
    console.warn('⚠️ 可灵API认证类型未知，图片生成将不可用');
  }

  console.log('✅ 配置验证通过');
  return true;
}

module.exports = {
  env,
  validateConfig
};