/**
 * 鸡尾酒生成控制器
 * 处理生成鸡尾酒和查询图片状态的请求
 */

const { getDoubaoService } = require('../services/doubao');
const { getKlingService } = require('../services/kling');
const { generateDoubaoPrompt, generateKlingPrompt } = require('../services/prompt');
const { isValidMood, getMoodLabel, moodMapping } = require('../config/constants');

class CocktailController {
  /**
   * 生成鸡尾酒
   * POST /api/generate-cocktail
   */
  async generateCocktail(req, res, next) {
    try {
      const { mood, moodLabel } = req.body;

      // 验证请求参数
      if (!mood) {
        return res.status(400).json({
          success: false,
          error: '缺少必要参数: mood'
        });
      }

      if (!isValidMood(mood)) {
        return res.status(400).json({
          success: false,
          error: `无效的情绪类型: ${mood}。支持的情绪: ${Object.keys(moodMapping).join(', ')}`
        });
      }

      console.log(`🍸 开始生成鸡尾酒，情绪: ${mood} (${getMoodLabel(mood)})`);

      // 获取豆包服务实例
      const doubaoService = getDoubaoService();

      // 生成prompt
      const prompt = generateDoubaoPrompt(mood);
      console.log('📝 [cocktail.js] 生成的豆包prompt (完整):');
      console.log('='.repeat(80));
      console.log(prompt);
      console.log('='.repeat(80));
      console.log(`📝 [cocktail.js] prompt长度: ${prompt.length} 字符`);

      // 调用豆包API生成鸡尾酒内容
      const cocktailData = await doubaoService.generateCocktailWithPrompt(mood, prompt);
      console.log('✅ 鸡尾酒内容生成完成:', cocktailData.name);

      // 获取可灵服务实例
      const klingService = getKlingService();

      // 生成图像prompt
      const imagePromptData = {
        name: cocktailData.name,
        baseSpirit: cocktailData.ingredients[0],
        ingredient1: cocktailData.ingredients[1],
        ingredient2: cocktailData.ingredients[2],
        glassType: cocktailData.glassType,
        glassDescription: cocktailData.glassDescription, // 添加酒杯描述
        color1: cocktailData.color1,
        color2: cocktailData.color2
      };

      const imagePrompt = generateKlingPrompt(imagePromptData);
      console.log('🎨 生成图像prompt (完整):');
      console.log('='.repeat(80));
      console.log(imagePrompt);
      console.log('='.repeat(80));
      console.log(`🎨 图像prompt长度: ${imagePrompt.length} 字符`);

      // 调用可灵API生成图片
      let imageResult = null;
      try {
        imageResult = await klingService.generateImage(imagePrompt, {
          width: 512,
          height: 512,
          stylePreset: 'pixel-art'
        });

        // 更新鸡尾酒数据，添加图片生成ID
        cocktailData.imageGenerationId = imageResult.generationId;
        cocktailData.imageStatus = imageResult.status;
        cocktailData.imageStatusMessage = imageResult.message;

        console.log(`✅ 图片生成任务已创建，ID: ${imageResult.generationId}`);
      } catch (imageError) {
        console.warn('⚠️ 图片生成失败，继续返回鸡尾酒数据:', imageError.message);
        // 设置图片生成失败标志
        cocktailData.imageGenerationId = null;
        cocktailData.imageStatus = 'failed';
        cocktailData.imageStatusMessage = imageError.message;
        imageResult = null;
      }

      // 构建包含debugInfo的响应数据
      const responseData = {
        ...cocktailData,
        debugInfo: {
          doubaoPrompt: prompt,
          klingPrompt: imagePrompt,
          promptLengths: {
            doubao: prompt.length,
            kling: imagePrompt.length
          },
          generatedAt: new Date().toISOString()
        }
      };

      // 返回响应
      res.status(200).json({
        success: true,
        message: '鸡尾酒生成成功，图片生成中...',
        data: responseData
      });

    } catch (error) {
      console.error('❌ 生成鸡尾酒失败:', error);

      // 根据错误类型返回不同的状态码
      let statusCode = 500;
      let errorMessage = error.message;

      if (error.message.includes('无效的情绪类型') || error.message.includes('缺少必要参数')) {
        statusCode = 400;
      } else if (error.message.includes('API密钥无效') || error.message.includes('未配置')) {
        statusCode = 503;
        errorMessage = 'AI服务暂时不可用，请稍后重试';
      } else if (error.message.includes('超限') || error.message.includes('频率')) {
        statusCode = 429;
        errorMessage = '请求过于频繁，请稍后重试';
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: error.stack })
      });
    }
  }

  /**
   * 查询图片生成状态
   * GET /api/image-status/:generationId
   */
  async getImageStatus(req, res, next) {
    try {
      const { generationId } = req.params;

      if (!generationId) {
        return res.status(400).json({
          success: false,
          error: '缺少必要参数: generationId'
        });
      }

      console.log(`🔍 查询图片生成状态，ID: ${generationId}`);

      // 获取可灵服务实例
      const klingService = getKlingService();

      // 查询图片生成状态
      const statusResult = await klingService.getImageStatus(generationId);

      if (!statusResult.success) {
        return res.status(404).json({
          success: false,
          error: statusResult.error || '图片生成任务不存在'
        });
      }

      // 构建响应
      const response = {
        success: true,
        generationId: statusResult.generationId,
        status: statusResult.status,
        estimatedTime: statusResult.estimatedTime
      };

      // 如果图片已生成完成，添加图片URL
      if (statusResult.status === 'completed' && statusResult.imageUrl) {
        response.imageUrl = statusResult.imageUrl;
        response.message = '图片生成完成';
      } else if (statusResult.status === 'failed') {
        response.message = '图片生成失败，请重试';
      } else {
        response.message = `图片生成中，预计${statusResult.estimatedTime}`;
      }

      res.status(200).json(response);

    } catch (error) {
      console.error('❌ 查询图片状态失败:', error);

      res.status(500).json({
        success: false,
        error: '查询图片状态失败',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }

  /**
   * 批量查询图片生成状态（可选功能）
   */
  async getBatchImageStatus(req, res, next) {
    try {
      const { generationIds } = req.body;

      if (!generationIds || !Array.isArray(generationIds)) {
        return res.status(400).json({
          success: false,
          error: '缺少必要参数: generationIds (数组)'
        });
      }

      console.log(`🔍 批量查询图片生成状态，数量: ${generationIds.length}`);

      const klingService = getKlingService();
      const results = [];

      // 并行查询所有状态
      for (const generationId of generationIds) {
        try {
          const status = await klingService.getImageStatus(generationId);
          results.push({
            generationId,
            success: status.success,
            status: status.status,
            imageUrl: status.imageUrl,
            estimatedTime: status.estimatedTime
          });
        } catch (error) {
          results.push({
            generationId,
            success: false,
            error: error.message
          });
        }
      }

      // 统计状态
      const completed = results.filter(r => r.status === 'completed').length;
      const pending = results.filter(r => r.status === 'pending').length;
      const generating = results.filter(r => r.status === 'generating').length;
      const failed = results.filter(r => r.status === 'failed').length;

      res.status(200).json({
        success: true,
        message: `批量查询完成，完成: ${completed}, 等待中: ${pending}, 生成中: ${generating}, 失败: ${failed}`,
        results,
        summary: { completed, pending, generating, failed }
      });

    } catch (error) {
      console.error('❌ 批量查询图片状态失败:', error);

      res.status(500).json({
        success: false,
        error: '批量查询图片状态失败',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }
}

// 导出控制器实例
module.exports = new CocktailController();