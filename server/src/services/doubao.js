/**
 * 豆包大语言模型API服务
 * 调用豆包API生成鸡尾酒内容
 */

const axios = require('axios');
const { env } = require('../config');

class DoubaoService {
  constructor() {
    this.apiKey = env.doubaoApiKey;
    this.apiUrl = env.doubaoApiUrl;
    this.model = env.doubaoModel;
    this.timeout = env.timeout.doubao;

    console.log(`豆包服务初始化: apiKey="${this.apiKey ? this.apiKey.substring(0, 10) + '...' : '未配置'}", apiUrl="${this.apiUrl}", model="${this.model}"`);
    console.log('完整API密钥:', this.apiKey ? '已配置' : '未配置');

    if (!this.apiKey) {
      throw new Error('DOUBAO_API_KEY未配置');
    }

    // 创建axios实例
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }

  /**
   * 调用豆包API生成鸡尾酒内容
   * @param {string} prompt - 完整的prompt模板
   * @returns {Promise<string>} - AI生成的鸡尾酒内容文本
   */
  async generateCocktail(prompt) {
    try {
      console.log('📝 调用豆包API生成鸡尾酒...');
      console.log(`🌐 API URL: ${this.apiUrl}/responses`);
      console.log(`⏱️ 超时时间: ${this.timeout}ms`);
      console.log(`🔑 API密钥: ${this.apiKey ? this.apiKey.substring(0, 10) + '...' : '未配置'}`);
      console.log(`🤖 模型: ${this.model}`);
      console.log(`📄 提示长度: ${prompt.length}字符`);
      console.log('📄 [doubao.js] 完整prompt内容:');
      console.log('='.repeat(80));
      console.log(prompt);
      console.log('='.repeat(80));
      console.log('请求headers:', this.client.defaults.headers);

      const requestBody = {
        model: this.model, // 从配置中获取模型，如：doubao-seed-2-0-pro-260215
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: prompt
              }
            ]
          }
        ]
      };

      // 火山引擎API使用/responses端点
      const response = await this.client.post('/responses', requestBody);

      if (!response.data || !response.data.output || response.data.output.length < 2) {
        console.error('豆包API返回格式错误:', JSON.stringify(response.data, null, 2));
        throw new Error('豆包API返回格式错误，缺少output字段');
      }

      // 从output数组中查找message类型的响应
      const messageOutput = response.data.output.find(item => item.type === 'message');
      if (!messageOutput || !messageOutput.content || messageOutput.content.length === 0) {
        console.error('豆包API响应中未找到message内容:', JSON.stringify(response.data, null, 2));
        throw new Error('豆包API返回格式错误，未找到message内容');
      }

      // 查找output_text类型的内容
      const textContent = messageOutput.content.find(item => item.type === 'output_text');
      if (!textContent || !textContent.text) {
        console.error('豆包API响应中未找到文本内容:', JSON.stringify(messageOutput, null, 2));
        throw new Error('豆包API返回格式错误，未找到文本内容');
      }

      const content = textContent.text;
      console.log('✅ 豆包API调用成功');
      console.log('📄 原始响应内容:', content);
      return content;

    } catch (error) {
      console.error('❌ 豆包API调用失败:', error.message);
      console.error('错误详情:', {
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : '无响应',
        request: error.request ? '请求已发送但无响应' : '请求未发送',
        config: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout,
          headers: error.config?.headers ? Object.keys(error.config.headers) : '无'
        }
      });

      // 根据错误类型提供更友好的错误信息
      if (error.response) {
        // API返回了错误状态码
        console.error('API响应状态:', error.response.status);
        console.error('API响应数据:', error.response.data);

        if (error.response.status === 401) {
          throw new Error('豆包API密钥无效或已过期');
        } else if (error.response.status === 429) {
          throw new Error('豆包API调用频率超限，请稍后重试');
        } else if (error.response.status >= 500) {
          throw new Error('豆包API服务暂时不可用，请稍后重试');
        }
      } else if (error.request) {
        // 请求已发送但未收到响应
        throw new Error('豆包API请求超时，请检查网络连接');
      }

      throw new Error(`豆包API调用失败: ${error.message}`);
    }
  }

  /**
   * 生成鸡尾酒并返回结构化数据
   * @param {string} mood - 情绪类型
   * @param {string} prompt - 生成的prompt
   * @returns {Promise<Object>} - 结构化的鸡尾酒数据
   */
  async generateCocktailWithPrompt(mood, prompt) {
    try {
      console.log(`📝 [doubao.js] 开始生成鸡尾酒，情绪: ${mood}`);
      console.log(`📄 [doubao.js] prompt长度: ${prompt.length} 字符`);
      // 调用豆包API
      const aiResponse = await this.generateCocktail(prompt);

      // 解析响应
      const { parseCocktailResponse, buildCocktailData } = require('./prompt');
      const parsedData = parseCocktailResponse(aiResponse);
      const cocktailData = buildCocktailData(mood, parsedData);

      return cocktailData;

    } catch (error) {
      console.error('生成鸡尾酒失败，尝试使用模拟模式:', error.message);
      // 回退到模拟模式
      return await this.generateMockCocktail(mood);
    }
  }

  /**
   * 模拟模式：用于开发和测试
   * 当API密钥未配置时使用模拟数据
   */
  async generateMockCocktail(mood) {
    console.log('⚠️ 使用模拟数据（豆包API密钥未配置）');

    const mockCocktails = {
      happy: {
        name: '落日微醺金酒',
        description: '落日橙与玫瑰盐，敬今日的微醺浪漫',
        ingredients: ['金酒', '西柚汁', '玫瑰糖浆'],
        alcoholContent: 8,
        glassType: '马天尼杯',
        color1: '#FF6B9D',
        color2: '#9D4EDD'
      },
      tired: {
        name: '琥珀安眠',
        description: '温暖琥珀色，让疲惫在醇厚中沉淀',
        ingredients: ['威士忌', '蜂蜜', '柠檬汁'],
        alcoholContent: 12,
        glassType: '古典杯',
        color1: '#D2691E',
        color2: '#8B4513'
      }
    };

    // 返回模拟数据或默认数据
    const mockData = mockCocktails[mood] || mockCocktails.happy;

    const { buildCocktailData } = require('./prompt');
    const parsedData = {
      name: mockData.name,
      baseSpirit: mockData.ingredients[0],
      ingredient1: mockData.ingredients[1],
      ingredient2: mockData.ingredients[2],
      ingredients: mockData.ingredients,
      alcoholContent: mockData.alcoholContent,
      glassType: mockData.glassType,
      description: mockData.description,
      color1: mockData.color1,
      color2: mockData.color2
    };

    return buildCocktailData(mood, parsedData);
  }
}

// 创建单例实例
let instance = null;
function getDoubaoService() {
  if (!instance) {
    try {
      instance = new DoubaoService();
    } catch (error) {
      console.warn('豆包服务初始化失败，将使用模拟模式:', error.message);
      instance = {
        generateCocktailWithPrompt: async (mood, prompt) => {
          return await this.generateMockCocktail(mood);
        },
        generateMockCocktail: async (mood) => {
          // 模拟实现
          const { buildCocktailData } = require('./prompt');
          const { getMoodLabel } = require('../config/constants');

          const mockData = {
            name: `${getMoodLabel(mood)}特调`,
            description: '这是一杯模拟生成的鸡尾酒，实际使用时需要配置API密钥',
            ingredients: ['基酒', '食材1', '食材2'],
            alcoholContent: 10,
            glassType: '通用酒杯',
            color1: '#FF0000',
            color2: '#00FF00'
          };

          const parsedData = {
            name: mockData.name,
            baseSpirit: mockData.ingredients[0],
            ingredient1: mockData.ingredients[1],
            ingredient2: mockData.ingredients[2],
            ingredients: mockData.ingredients,
            alcoholContent: mockData.alcoholContent,
            glassType: mockData.glassType,
            description: mockData.description,
            color1: mockData.color1,
            color2: mockData.color2
          };

          return buildCocktailData(mood, parsedData);
        }
      };
    }
  }
  return instance;
}

module.exports = { getDoubaoService };