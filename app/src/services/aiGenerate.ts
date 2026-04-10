import type { MoodType, Cocktail } from '@/types';
import { generateCocktailWithImage } from './apiService';

// Generate cocktail using AI (real API only - no mock fallback)
export async function generateCocktail(mood: MoodType): Promise<Cocktail> {
  try {
    console.log(`🍸 开始生成鸡尾酒，情绪: ${mood}`);

    // 调用真实API（如果可灵API失败，图片字段会为null，但鸡尾酒数据会返回）
    const cocktail = await generateCocktailWithImage(mood);

    console.log(`✅ 鸡尾酒生成成功: ${cocktail.name}`);
    return cocktail;

  } catch (error) {
    console.error('❌ API调用失败，按照用户要求不显示图片:', error);
    // 根据用户要求，如果API失败直接抛出错误，不使用模拟数据
    throw error;
  }
}


// 预加载图片函数（暂时保持空实现）
export function preloadCocktailImages(): void {
  console.log('预加载鸡尾酒图片（真实API模式下不需要预加载）');
}

// 导出API服务函数以供其他组件使用
export { generateCocktailWithImage } from './apiService';