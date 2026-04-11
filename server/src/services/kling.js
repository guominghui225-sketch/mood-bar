/**
 * 可灵图像生成API服务
 * 调用可灵API生成鸡尾酒图片，支持生成状态跟踪
 * 注意：可灵API使用JWT token认证，需要Access Key和Secret Key
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { env } = require('../config');

class KlingService {
  constructor() {
    this.accessKey = env.klingAccessKey;
    this.secretKey = env.klingSecretKey;
    this.apiKey = env.klingApiKey; // 简单API Key
    this.apiUrl = env.klingApiUrl;
    this.timeout = env.timeout.kling;
    this.authType = env.klingAuthType; // 'jwt', 'bearer', or 'mock'

    // 根据认证类型检查配置
    if (this.authType === 'jwt') {
      if (!this.accessKey || !this.secretKey) {
        throw new Error('可灵API JWT认证配置不完整，缺少access key或secret key');
      }
      console.log('✅ 可灵API使用JWT认证');
    } else if (this.authType === 'bearer') {
      if (!this.apiKey) {
        throw new Error('可灵API Bearer token未配置');
      }
      console.log('✅ 可灵API使用Bearer token认证');
    } else if (this.authType === 'mock') {
      console.warn('⚠️ 可灵API使用模拟模式，图片生成将无法工作');
    } else {
      throw new Error(`未知的可灵API认证类型: ${this.authType}`);
    }

    // 创建axios实例（token会在每次请求时动态生成）
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 存储生成任务状态（内存缓存，生产环境应使用Redis等）
    this.generationTasks = new Map();
  }

  /**
   * 生成JWT token
   * @returns {string} JWT token
   */
  generateJwtToken() {
    const headers = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      iss: this.accessKey,
      exp: Math.floor(Date.now() / 1000) + 1800, // 有效时间30分钟
      nbf: Math.floor(Date.now() / 1000) - 5     // 开始生效时间（当前时间-5秒）
    };

    return jwt.sign(payload, this.secretKey, { header: headers });
  }

  /**
   * 获取认证header
   * @returns {Object} 包含Authorization header的对象
   */
  getAuthHeaders() {
    switch (this.authType) {
      case 'jwt':
        if (!this.accessKey || !this.secretKey) {
          throw new Error('JWT认证配置不完整，无法生成token');
        }
        const token = this.generateJwtToken();
        return {
          'Authorization': `Bearer ${token}`
        };

      case 'bearer':
        if (!this.apiKey) {
          throw new Error('Bearer token未配置');
        }
        return {
          'Authorization': `Bearer ${this.apiKey}`
        };

      case 'mock':
        console.warn('⚠️ 使用模拟模式，无认证header');
        return {};

      default:
        throw new Error(`未知的认证类型: ${this.authType}`);
    }
  }

  /**
   * 生成鸡尾酒图片
   * @param {string} prompt - 图像生成prompt
   * @param {Object} options - 生成选项
   * @returns {Promise<Object>} - 包含生成ID和初始状态的对象
   */
  async generateImage(prompt, options = {}) {
    // 检查认证类型，如果是mock模式则直接失败
    if (this.authType === 'mock') {
      throw new Error('可灵API未配置，图片生成功能不可用');
    }

    // 验证认证配置
    if (this.authType === 'jwt' && (!this.accessKey || !this.secretKey)) {
      throw new Error('可灵API JWT认证配置不完整，无法生成图片');
    }
    if (this.authType === 'bearer' && !this.apiKey) {
      throw new Error('可灵API Bearer token未配置，无法生成图片');
    }

    try {
      console.log('🎨 调用可灵API生成图片...');
      console.log('📄 [kling.js] 图像生成prompt:');
      console.log('='.repeat(80));
      console.log(prompt);
      console.log('='.repeat(80));
      console.log(`📄 prompt长度: ${prompt.length} 字符`);

      // OpenAI DALL-E 格式的请求体
      const size = options.size || `${options.width || 512}x${options.height || 512}`;
      const requestBody = {
        prompt: prompt,
        n: options.numImages || 1,
        size: size,
        response_format: options.responseFormat || 'url',
        // 可灵可能支持的质量参数
        quality: options.quality || 'standard',
        // 可灵可能支持的风格参数
        style: options.style || 'vivid'
      };

      // 保留可选参数
      if (options.seed) requestBody.seed = options.seed;
      if (options.stylePreset) requestBody.style_preset = options.stylePreset;

      // 生成当前请求的认证token
      const authHeaders = this.getAuthHeaders();

      const response = await this.client.post('', requestBody, {
        headers: authHeaders
      });

      if (!response.data || !response.data.data || !response.data.data.task_id) {
        throw new Error('可灵API返回格式错误');
      }

      const generationId = response.data.data.task_id;
      const taskStatus = this.mapKlingStatus(response.data.data.task_status) || 'pending';
      const task = {
        id: generationId,
        status: taskStatus,
        prompt: prompt,
        createdAt: new Date().toISOString(),
        imageUrl: null
      };

      // 存储任务状态
      this.generationTasks.set(generationId, task);

      console.log(`✅ 图片生成任务已提交，ID: ${generationId}, 状态: ${taskStatus}`);
      return {
        generationId,
        status: taskStatus,
        message: '图片生成任务已提交，请稍后查询状态'
      };

    } catch (error) {
      console.error('❌ 可灵API调用失败:', error.message);

      if (error.response) {
        console.error('API响应状态:', error.response.status);
        console.error('API响应数据:', error.response.data);

        // 如果是认证错误，提供更具体的错误信息
        if (error.response.status === 401) {
          throw new Error('可灵API认证失败，请检查API密钥配置');
        } else if (error.response.status === 429) {
          throw new Error('可灵API调用频率超限，请稍后重试');
        } else if (error.response.status >= 500) {
          throw new Error('可灵API服务暂时不可用，请稍后重试');
        }
      }

      // 直接抛出错误，不进行模拟模式回退
      throw new Error(`可灵API调用失败: ${error.message}`);
    }
  }

  /**
   * 查询图片生成状态
   * @param {string} generationId - 生成任务ID
   * @returns {Promise<Object>} - 生成状态和图片URL（如果已完成）
   */
  async getImageStatus(generationId) {
    // 检查认证类型，如果是mock模式则直接失败
    if (this.authType === 'mock') {
      throw new Error('可灵API未配置，图片状态查询功能不可用');
    }

    // 验证认证配置
    if (this.authType === 'jwt' && (!this.accessKey || !this.secretKey)) {
      throw new Error('可灵API JWT认证配置不完整，无法查询图片状态');
    }
    if (this.authType === 'bearer' && !this.apiKey) {
      throw new Error('可灵API Bearer token未配置，无法查询图片状态');
    }

    try {
      // 根据可灵API的实际接口设计调整
      // 假设可灵提供状态查询接口：GET /v1/images/generations/{id}
      const authHeaders = this.getAuthHeaders();

      const response = await this.client.get(`/${generationId}`, {
        headers: authHeaders
      });

      if (!response.data || !response.data.data) {
        throw new Error('可灵API状态查询返回格式错误');
      }

      const taskData = response.data.data;
      let task = this.generationTasks.get(generationId);

      if (!task) {
        task = {
          id: generationId,
          status: this.mapKlingStatus(taskData.task_status) || 'unknown',
          prompt: taskData.prompt || '',
          createdAt: taskData.created_at ? new Date(taskData.created_at).toISOString() : new Date().toISOString(),
          imageUrl: taskData.task_result?.images?.[0]?.url || null
        };
        this.generationTasks.set(generationId, task);
      } else {
        task.status = this.mapKlingStatus(taskData.task_status) || task.status;
        task.imageUrl = taskData.task_result?.images?.[0]?.url || task.imageUrl;
      }

      // 如果状态为completed/succeed且有图片URL，更新任务
      if ((task.status === 'completed' || taskData.task_status === 'succeed') && taskData.task_result?.images?.[0]?.url) {
        task.imageUrl = taskData.task_result.images[0].url;
        task.status = 'completed';
        console.log(`✅ 图片生成完成: ${task.imageUrl}`);
      }

      return {
        success: true,
        generationId,
        status: task.status,
        imageUrl: task.imageUrl,
        estimatedTime: this.getEstimatedTime(task.status)
      };

    } catch (error) {
      console.error('❌ 图片状态查询失败:', error.message);

      // 如果查询失败但任务存在，返回缓存状态
      const cachedTask = this.generationTasks.get(generationId);
      if (cachedTask) {
        console.log('使用缓存的图片生成状态');
        return {
          success: true,
          generationId,
          status: cachedTask.status,
          imageUrl: cachedTask.imageUrl,
          estimatedTime: this.getEstimatedTime(cachedTask.status)
        };
      }

      // 没有缓存任务，直接抛出错误
      throw new Error(`图片状态查询失败: ${error.message}`);
    }
  }

  /**
   * 根据状态返回预估时间
   */
  getEstimatedTime(status) {
    const estimates = {
      pending: '10-30秒',
      generating: '5-15秒',
      completed: '已完成',
      failed: '生成失败'
    };
    return estimates[status] || '未知';
  }

  /**
   * 映射可灵API状态到内部状态
   */
  mapKlingStatus(klingStatus) {
    const statusMap = {
      'submitted': 'pending',
      'generating': 'generating',
      'succeed': 'completed',
      'failed': 'failed'
    };
    return statusMap[klingStatus] || 'unknown';
  }

  /**
   * 模拟图片生成（用于开发和测试）
   */
  async generateMockImage() {
    const generationId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const task = {
      id: generationId,
      status: 'pending',
      prompt: '模拟图片生成',
      createdAt: new Date().toISOString(),
      imageUrl: null
    };

    this.generationTasks.set(generationId, task);

    // 模拟延迟后状态变为完成
    setTimeout(() => {
      task.status = 'completed';
      task.imageUrl = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=512&h=512&fit=crop'; // 模拟图片URL
      console.log(`✅ 模拟图片生成完成: ${generationId}`);
    }, 3000); // 3秒后完成

    return {
      generationId,
      status: 'pending',
      message: '模拟图片生成已开始，约3秒后完成'
    };
  }

  /**
   * 模拟图片状态查询
   */
  async getMockImageStatus(generationId) {
    const task = this.generationTasks.get(generationId);

    if (!task) {
      return {
        success: false,
        error: '生成任务不存在',
        generationId
      };
    }

    // 模拟进度更新
    if (task.status === 'pending' && Date.now() - new Date(task.createdAt).getTime() > 3000) {
      task.status = 'completed';
      task.imageUrl = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=512&h=512&fit=crop';
    }

    return {
      success: true,
      generationId,
      status: task.status,
      imageUrl: task.imageUrl,
      estimatedTime: this.getEstimatedTime(task.status)
    };
  }

  /**
   * 清理过期的生成任务
   */
  cleanupOldTasks(maxAgeHours = 24) {
    const now = new Date();
    const maxAge = maxAgeHours * 60 * 60 * 1000; // 转换为毫秒

    for (const [generationId, task] of this.generationTasks.entries()) {
      const taskAge = now - new Date(task.createdAt);
      if (taskAge > maxAge) {
        this.generationTasks.delete(generationId);
        console.log(`🧹 清理过期生成任务: ${generationId}`);
      }
    }
  }
}

// 创建单例实例
let instance = null;
function getKlingService() {
  if (!instance) {
    try {
      instance = new KlingService();

      // 每小时清理一次过期任务
      setInterval(() => instance.cleanupOldTasks(), 60 * 60 * 1000);
    } catch (error) {
      console.warn('可灵服务初始化失败，将使用模拟模式:', error.message);
      instance = {
        generateImage: async (prompt, options) => {
          console.warn('可灵模拟模式: 图片生成不可用');
          return {
            generationId: `mock-${Date.now()}`,
            status: 'failed',
            message: '图片生成服务不可用，请检查API配置'
          };
        },
        getImageStatus: async (generationId) => {
          return {
            status: 'failed',
            message: '图片生成服务不可用'
          };
        },
        cleanupOldTasks: () => {}
      };
    }
  }
  return instance;
}

module.exports = { getKlingService };