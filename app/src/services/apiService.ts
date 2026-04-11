/**
 * Mood Bar API 服务
 * 调用后端API生成鸡尾酒和查询图片状态
 */

import type { MoodType, Cocktail, ApiCocktailResponse, ApiImageStatusResponse } from '@/types';
import { getMoodLabel } from '@/constants';

// 后端API基础URL
// 如果VITE_API_BASE_URL为空字符串，则使用相对路径（用于Vercel部署）
// 如果未定义，则使用localhost开发环境
const API_BASE_URL = (() => {
  const envValue = import.meta.env.VITE_API_BASE_URL;
  const isProduction = import.meta.env.PROD;

  console.warn('🔧 API_BASE_URL环境变量值:', {
    envValue,
    isUndefined: envValue === undefined,
    isEmptyString: envValue === '',
    isStringUndefined: envValue === 'undefined',
    mode: import.meta.env.MODE,
    isProduction,
    location: window?.location?.href || 'unknown'
  });

  // 强制生产环境逻辑：如果检测到生产环境，强制使用相对路径
  if (isProduction) {
    console.warn('🔧 生产环境检测到，强制使用相对路径（空字符串）');
    return '';
  }

  // 开发环境逻辑
  // 如果未定义或空字符串或字符串'undefined'，使用空字符串（相对路径）
  if (envValue === undefined || envValue === '' || envValue === 'undefined') {
    console.warn('🔧 使用相对路径（空字符串）');
    return '';
  }

  // 安全检查：如果URL包含localhost或127.0.0.1，在非开发模式下警告
  if (envValue && (envValue.includes('localhost') || envValue.includes('127.0.0.1')) && !import.meta.env.DEV) {
    console.error('❌ 非开发环境中检测到localhost URL:', envValue);
    console.error('❌ 强制使用相对路径');
    return '';
  }

  console.warn(`🔧 使用API基础URL: "${envValue}"`);
  return envValue;
})();

/**
 * 生成鸡尾酒
 */
export async function generateCocktail(mood: MoodType): Promise<Cocktail> {
  try {
    console.log(`🎯 调用后端API生成鸡尾酒，情绪: ${mood}`);
    console.group('📝 传输给模型的prompt信息');

    const response = await fetch(`${API_BASE_URL}/api/generate-cocktail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood,
        moodLabel: getMoodLabel(mood) // 临时函数，稍后需要从constants获取
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const result: ApiCocktailResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || '鸡尾酒生成失败');
    }

    // 只在开发环境显示详细prompt信息
    const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

    if (result.data.debugInfo) {
      if (isDevelopment) {
        console.log('🔵 豆包API prompt:');
        console.log('='.repeat(80));
        console.log(result.data.debugInfo.doubaoPrompt);
        console.log('='.repeat(80));
        console.log(`📏 长度: ${result.data.debugInfo.promptLengths.doubao} 字符`);

        console.log('\n🟣 可灵API prompt:');
        console.log('='.repeat(80));
        console.log(result.data.debugInfo.klingPrompt);
        console.log('='.repeat(80));
        console.log(`📏 长度: ${result.data.debugInfo.promptLengths.kling} 字符`);

        console.log(`\n⏰ 生成时间: ${result.data.debugInfo.generatedAt}`);
      } else {
        // 生产环境只显示简要信息
        console.log(`🔵 豆包API prompt长度: ${result.data.debugInfo.promptLengths.doubao} 字符`);
        console.log(`🟣 可灵API prompt长度: ${result.data.debugInfo.promptLengths.kling} 字符`);
      }
    }

    console.groupEnd();

    console.log(`✅ 鸡尾酒生成成功: ${result.data.name}`);

    // 移除debugInfo，保持原有数据结构
    const { debugInfo, ...cocktailData } = result.data;
    return cocktailData;

  } catch (error) {
    console.error('❌ 调用后端API失败:', error);
    throw error;
  }
}

/**
 * 查询图片生成状态
 */
export async function getImageStatus(generationId: string): Promise<ApiImageStatusResponse> {
  try {
    console.log(`🔍 查询图片生成状态: ${generationId}`);

    const response = await fetch(`${API_BASE_URL}/api/image-status/${generationId}`);

    if (!response.ok) {
      throw new Error(`状态查询失败: ${response.status} ${response.statusText}`);
    }

    const result: ApiImageStatusResponse = await response.json();
    return result;

  } catch (error) {
    console.error('❌ 图片状态查询失败:', error);
    throw error;
  }
}

/**
 * 轮询图片生成状态直到完成
 */
export async function pollImageStatus(
  generationId: string,
  intervalMs = 2000,
  maxAttempts = 30
): Promise<string> {
  console.log(`🔄 开始轮询图片状态: ${generationId}`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const status = await getImageStatus(generationId);

      console.log(`📊 轮询进度 [${attempt}/${maxAttempts}]: ${status.status}`);

      if (status.status === 'completed' && status.imageUrl) {
        console.log(`✅ 图片生成完成: ${status.imageUrl}`);
        return status.imageUrl;
      }

      if (status.status === 'failed') {
        console.warn('⚠️ 图片生成失败，返回null图片URL');
        return null; // 图片生成失败，返回null而不是抛出错误
      }

      // 如果未完成，等待后继续
      await new Promise(resolve => setTimeout(resolve, intervalMs));

    } catch (error) {
      console.error(`❌ 第 ${attempt} 次轮询失败:`, error);
      if (attempt === maxAttempts) {
        throw new Error(`图片生成超时: ${error.message}`);
      }
    }
  }

  throw new Error('图片生成超时，达到最大重试次数');
}

/**
 * 生成鸡尾酒并等待图片完成
 */
export async function generateCocktailWithImage(mood: MoodType): Promise<Cocktail> {
  try {
    // 1. 生成鸡尾酒配方
    const cocktail = await generateCocktail(mood);

    // 2. 如果已经有图片URL，直接返回
    if (cocktail.imageUrl) {
      console.log('✅ 鸡尾酒已包含图片URL');
      return cocktail;
    }

    // 3. 如果没有图片但需要生成，等待图片生成完成
    if (cocktail.imageGenerationId) {
      console.log(`🖼️ 等待图片生成: ${cocktail.imageGenerationId}`);
      const imageUrl = await pollImageStatus(cocktail.imageGenerationId);
      if (imageUrl) {
        cocktail.imageUrl = imageUrl;
        cocktail.imageStatus = 'completed';
        cocktail.imageStatusMessage = '图片生成完成';
      } else {
        // 图片生成失败，保持imageUrl为null
        cocktail.imageStatus = 'failed';
        cocktail.imageStatusMessage = '图片生成失败';
      }
    }

    return cocktail;

  } catch (error) {
    console.error('❌ 生成鸡尾酒和图片失败:', error);
    throw error;
  }
}

/**
 * 模拟模式已移除 - 根据用户要求，如果API不可用直接不显示图片，不使用模拟数据
 * 此函数已废弃，保留导出以保持向后兼容
 */
export async function generateMockCocktail(mood: MoodType): Promise<Cocktail> {
  throw new Error('模拟模式已禁用。请检查API配置或网络连接。');
}

