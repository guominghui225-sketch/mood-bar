/**
 * Prompt模板管理系统
 * 根据情绪词和配置生成豆包API和可灵API的prompt
 * 增强版：大幅增加随机性，提高生成多样性
 */

const { getMoodConfig, getRandomBaseSpirit, getRandomGlassType, getRandomColors } = require('../config/constants');

/**
 * 加权随机选择器 - 避免短期重复，确保元素轮换
 */
class RandomSelector {
  constructor(items, options = {}) {
    this.items = items;
    this.recentCount = options.recentCount || Math.min(5, Math.floor(items.length / 2));
    this.recentItems = [];
  }

  /**
   * 加权随机选择，避免最近使用过的元素
   */
  select() {
    // 计算权重：最近使用过的权重降低
    const weights = this.items.map((item, index) => {
      const recentIndex = this.recentItems.indexOf(item);
      if (recentIndex >= 0) {
        // 最近使用过，权重降低（越近权重越低）
        const penalty = 0.1 / (recentIndex + 1); // 权重降低到10%-50%
        return penalty;
      }
      return 1; // 正常权重
    });

    // 加权随机选择
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < this.items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        const selected = this.items[i];

        // 添加到最近使用列表
        this.recentItems.unshift(selected);
        if (this.recentItems.length > this.recentCount) {
          this.recentItems.pop();
        }

        return selected;
      }
    }

    // 回退到普通随机
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  /**
   * 重置历史记录
   */
  reset() {
    this.recentItems = [];
  }
}

/**
 * 随机化元素库 - 大幅增加prompt多样性
 */
const randomizationElements = {
  // 装饰风格描述
  decorationStyles: [
    '简约现代风格',
    '复古奢华风格',
    '自然清新风格',
    '赛博朋克风格',
    '浪漫梦幻风格',
    '极简主义风格',
    '艺术创意风格',
    '奢华精致风格',
    '街头潮流风格',
    '手工艺术风格'
  ],

  // 口感描述词
  tasteDescriptions: [
    '丝滑绵密',
    '清爽刺激',
    '浓郁醇厚',
    '轻盈活泼',
    '层次丰富',
    '细腻柔和',
    '劲爽炸裂',
    '温和顺滑',
    '清新淡雅',
    '回味悠长'
  ],

  // 视觉元素
  visualElements: [
    '渐变分层效果',
    '气泡上升动态',
    '冰晶闪烁质感',
    '光晕扩散效果',
    '液体流动轨迹',
    '色彩碰撞对比',
    '光影交织层次',
    '晶莹剔透质感',
    '迷雾朦胧氛围',
    '璀璨星光点缀'
  ],

  // 特殊要求
  specialRequirements: [
    '要求包含季节性水果',
    '要求颜色对比度强烈（互补色或对比色）',
    '要求酒名要有诗意隐喻，避免直白描述',
    '要求酒精浓度与情绪强度精确匹配（高强度情绪>20%，低强度<15%）',
    '要求尝试一种非常规的装饰方式（如干冰、可食用花、跳跳糖）',
    '要求融合两种不同文化的元素',
    '要求创意命名，避免常见酒名',
    '要求视觉效果要有惊喜感',
    '要求口感层次至少包含三重变化',
    '要求装饰与酒的颜色形成鲜明对比'
  ],

  // prompt变体模板（添加简洁版本以提高响应速度）
  promptVariants: [
    "帮我生成一杯特调，包括特调名称（2-5字，带【情绪】关联）、3种原材料（1种【基酒】+2种食材，其中【食材2】为一种随机食物用于装饰，所有材料要契合酒的【风格】）、酒精浓度（3%-35%，匹配【情绪】强度）、酒杯类型（根据基酒和食材推荐合适的酒杯类型）、情绪文案（15字内，剔除ai味有诗意）、2种十六进制颜色代码（如#FF6B9D）用于增加酒杯周围氛围感（需要结合情绪）",
    "请设计一杯符合【情绪】氛围的鸡尾酒，需要包含：鸡尾酒名称（2-5字，创意命名）、3种原材料（基酒+主食材+装饰食材）、酒精浓度（精确百分比）、酒杯类型、情绪文案（15字内，诗意表达）、2种颜色代码（十六进制）作为视觉氛围元素",
    "构思一杯基于【情绪】主题的特调，具体要求：酒名（2-5字，有创意）、配方（基酒+2种食材，装饰食材要有趣）、酒精浓度、酒杯类型、简短情绪文案（15字内）、2种氛围颜色（十六进制）。请确保与【风格】高度匹配",
    "创作一杯展现【情绪】的创意鸡尾酒，包含：创意酒名、3种材料组合、合适的酒精浓度、匹配的酒杯类型、情绪文案、2种颜色氛围。所有元素都要与【情绪】和【风格】协调",
    // 简洁版本（优化响应速度）
    "生成一杯【情绪】主题鸡尾酒，含：酒名2-5字、基酒+2食材、酒精浓度%、酒杯类型、15字情绪文案、2种十六进制颜色。风格：【风格】"
  ],

  // 食材类别库
  ingredientCategories: {
    happy: ['树莓果泥', '柠檬汁', '橙皮糖浆', '草莓酱', '蜜桃汁', '百香果', '菠萝汁', '石榴糖浆', '芒果泥', '樱桃利口酒'],
    tired: ['肉桂糖浆', '蜂蜜', '焦糖酱', '姜汁', '黑糖', '枫糖浆', '巧克力酱', '咖啡利口酒', '杏仁糖浆', '核桃糖浆'],
    anxious: ['薄荷糖浆', '青柠汁', '黄瓜汁', '芦荟汁', '椰子水', '绿茶糖浆', '柚子汁', '西柚汁', '柠檬草糖浆', '迷迭香糖浆'],
    calm: ['薰衣草糖浆', '柠檬草糖浆', '蜂蜜', '枫糖浆', '接骨木花糖浆', '洋甘菊糖浆', '香草糖浆', '杏仁糖浆', '玫瑰糖浆', '桂花糖浆'],
    lonely: ['巧克力酱', '咖啡利口酒', '焦糖酱', '黑糖糖浆', '榛子糖浆', '威士忌糖浆', '香草精', '肉桂糖浆', '肉豆蔻粉', '丁香糖浆'],
    energetic: ['芒果泥', '菠萝汁', '百香果汁', '辣椒糖浆', '姜汁', '柠檬汁', '橙汁', '石榴糖浆', '草莓酱', '荔枝糖浆'],
    sad: ['樱桃利口酒', '葡萄汁', '棉花糖糖浆', '焦糖酱', '蜂蜜', '枫糖浆', '香草糖浆', '杏仁糖浆', '玫瑰糖浆', '薰衣草糖浆'],
    healing: ['薄荷糖浆', '柠檬汁', '蜂蜜', '黄瓜汁', '芦荟汁', '绿茶糖浆', '姜汁', '柠檬草糖浆', '洋甘菊糖浆', '柚子汁']
  },

  // 装饰食材库
  garnishIngredients: [
    '橙皮卷', '柠檬片', '樱桃', '橄榄', '薄荷枝', '糖边', '盐边', '巧克力碎',
    '跳跳糖', '彩色糖粒', '食用金箔', '花瓣', '水果片', '肉桂棒', '迷迭香枝',
    '百里香', '辣椒片', '姜片', '椰子片', '坚果碎', '棉花糖', '星星糖',
    '彩虹糖粒', '巧克力豆', '焦糖脆片', '蜂蜜滴', '糖霜', '金粉', '银粉'
  ]
};

/**
 * 从数组中随机选择元素
 */
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 从数组中随机选择指定数量的不重复元素
 */
function getRandomUniqueElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * 从数组中随机选择指定数量的元素
 */
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * 生成豆包API的鸡尾酒生成prompt（增强版）
 * 大幅增加随机性，提高生成多样性
 */
function generateDoubaoPrompt(mood) {
  const config = getMoodConfig(mood);

  // ==================== 随机化元素选择 ====================

  // 1. 随机选择3-4个关键词加入风格描述
  const randomKeywords = getRandomUniqueElements(config.keywords, Math.floor(Math.random() * 3) + 2); // 2-4个
  const keywordsText = randomKeywords.join('、');

  // 2. 随机选择装饰风格、口感描述、视觉元素
  const randomDecorationStyle = getRandomElement(randomizationElements.decorationStyles);
  const randomTasteDescription = getRandomElement(randomizationElements.tasteDescriptions);
  const randomVisualElement = getRandomElement(randomizationElements.visualElements);

  // 3. 随机选择1个特殊要求
  const randomSpecialRequirement = getRandomElement(randomizationElements.specialRequirements);

  // 4. 随机选择prompt变体模板
  const randomPromptVariant = getRandomElement(randomizationElements.promptVariants);

  // 5. 随机选择食材（从情绪专属食材库）
  const moodIngredients = randomizationElements.ingredientCategories[mood] || randomizationElements.ingredientCategories.happy;
  const randomMainIngredient = getRandomElement(moodIngredients);
  const randomGarnishIngredient = getRandomElement(randomizationElements.garnishIngredients);

  // 6. 生成随机推荐元素（使用新的随机化）
  const recommendedBaseSpirit = getRandomBaseSpirit(mood);
  const recommendedGlassType = getRandomGlassType(mood);
  const recommendedColors = getRandomColors(mood, 2);
  const recommendedColorsText = recommendedColors.join('、');

  // 7. 获取完整列表（用于可选参考）
  const baseSpiritsText = config.baseSpirits.join('、');
  const glassTypesText = config.glassTypes.slice(0, 6).join('、'); // 取前6个
  const colorsText = config.colorPalette.join('、');

  // ==================== 构建增强风格描述 ====================
  const enhancedStyle = `${config.style}，${randomTasteDescription}口感，${randomVisualElement}，${randomDecorationStyle}，包含${keywordsText}元素`;

  // ==================== 构建动态prompt ====================
  const template = `${randomPromptVariant}

请按照以下格式返回：
酒名：特调名称
基酒：基酒名称
食材1：食材1名称
食材2：食材2名称（装饰）
酒精浓度：XX%
酒杯类型：酒杯类型
酒杯描述：对酒杯的详细视觉描述，包括杯口、杯肚、杯柄、杯底的特征，以及材质、形状、用途等，用于图像生成参考（50-100字）
情绪文案：情绪文案
颜色1：#十六进制颜色代码
颜色2：#十六进制颜色代码

【情绪】${config.label}
【风格】${enhancedStyle}
【可选基酒】${baseSpiritsText}
【可选酒杯】${glassTypesText}
【颜色参考】${colorsText}
【食材建议】主食材建议：${randomMainIngredient}，装饰建议：${randomGarnishIngredient}
【推荐基酒】${recommendedBaseSpirit}（请优先考虑此选择）
【推荐酒杯】${recommendedGlassType}（推荐使用）
【推荐颜色】${recommendedColorsText}（建议搭配）
【特殊要求】${randomSpecialRequirement}

【酒杯描述要求 - 图像生成关键】
请为酒杯类型提供极其详细、视觉化的描述，专门用于图像生成AI参考。描述必须包含以下视觉特征：

1. 杯口特征：精确形状（圆形、椭圆形、喇叭形等）、直径大小、边缘设计（平直、外翻、内收）、特殊处理（盐边、糖边、金属镶边）
2. 杯肚特征：深度（浅、中、深）、宽度（窄、中等、宽）、容量（大致毫升数）、几何形状（锥形、圆柱形、球形、倒锥形）
3. 杯柄特征：长度（短、中、长）、粗细（细、中等、粗）、设计风格（直杆、螺旋、装饰性）、连接方式
4. 杯底特征：底座形状（圆形、方形、多边形）、直径、稳定性设计、是否加厚
5. 材质和质感：具体材质（水晶玻璃、普通玻璃、金属、陶瓷）、表面处理（透明清澈、磨砂雾面、哑光质感、光泽抛光）、厚度（薄壁、厚壁）
6. 视觉细节：光线透过效果（透明、半透明、不透明）、反光特性（高反光、低反光）、纹理（光滑、纹理、刻花）
7. 比例和尺寸：整体高度、最大宽度、关键比例关系
8. 设计风格：古典优雅、现代简约、复古经典、艺术装饰等

请用80-120字描述，使用具体、可视觉化的形容词。避免抽象描述，确保图像生成AI能根据文字精确绘制出逼真的酒杯。
示例格式："[酒杯类型]呈[形状]，杯口[特征]，杯肚[特征]，杯柄[特征]，杯底[特征]。材质为[材质]，表面[质感]。整体呈现[风格]设计，适合[用途]。"

【多样性要求】
请确保每次生成都不同，避免重复。特别要注意：
1. 避免使用相同的基酒+食材1+食材2组合
2. 尝试不同的酒杯类型，不要总是选择最常见的
3. 颜色组合要有创意，可以尝试对比色或渐变色
4. 酒名要有创意，不要使用过于常见的名称
5. 情绪文案要独特有诗意，避免模板化表达

【创意方向】
- 尝试意想不到的食材组合（如辣椒+芒果）
- 独特的装饰方式（如干冰烟雾、可食用花、跳跳糖）
- 创意的颜色渐变（如日落到星空）
- 创新的口感层次设计

请基于以上所有信息和推荐，创造一杯真正独特、有创意且符合【情绪】氛围的特调！`;

  // ==================== 日志记录 ====================
  console.log('🎲 [prompt.js] 增强版随机化元素:');
  console.log('  - 装饰风格:', randomDecorationStyle);
  console.log('  - 口感描述:', randomTasteDescription);
  console.log('  - 视觉元素:', randomVisualElement);
  console.log('  - 特殊要求:', randomSpecialRequirement);
  console.log('  - 食材建议:', { main: randomMainIngredient, garnish: randomGarnishIngredient });
  console.log('  - 随机关键词:', randomKeywords);
  console.log('  - prompt变体:', randomizationElements.promptVariants.indexOf(randomPromptVariant) + 1);
  console.log('📝 [prompt.js] prompt长度:', template.length, '字符');

  return template;
}

/**
 * 获取酒杯的详细视觉描述
 * 根据酒杯类型返回针对性的描述词，使生成的图像更贴合实际酒杯
 */
function getGlassDescription(glassType) {
  // 酒杯类型到详细描述的映射表（更全面）
  const glassDescriptions = {
    // === 高脚杯类 ===
    '马天尼杯': '经典锥形高脚杯，细长杯脚搭配逐渐收窄的杯身，杯口边缘略微外翻，适合盛装短饮酒，杯壁薄透晶莹',
    '水晶马天尼杯带细闪光泽': '高挑锥形水晶杯，杯身带有细闪光泽，杯口边缘有轻微反光，杯壁薄透，适合盛装透明或浅色鸡尾酒',
    '马天尼杯金属镶边': '锥形高脚杯，杯口边缘有金属镶边装饰，杯身细长，现代感十足',
    '香槟杯': '优雅郁金香形高脚杯，细长杯身能保留气泡，杯口略微收窄，适合展现气泡上升的轨迹',
    '香槟杯配气泡泡沫': '细长郁金香形香槟杯，杯底有持续上升的细小气泡，顶部形成细腻持久的泡沫层，杯脚细长优雅',
    '蝶形香槟杯': '经典蝶形香槟杯，杯口宽阔呈蝶翼状展开，杯身浅而宽，适合展现气泡上升的美感',
    '鸡尾酒杯': '经典鸡尾酒杯，细长杯脚搭配锥形杯身，造型优雅，适合盛装短饮酒',
    '小高脚透明杯': '小巧高脚杯，杯身透明，杯脚细短，适合小份量鸡尾酒',
    '细脚马天尼杯': '细长杯脚的马天尼杯，杯身锥形，整体造型更加修长优雅',
    '透明水晶柯林斯杯': '高挑透明水晶柯林斯杯，杯身修长线条流畅，材质通透晶莹',
    '清新玻璃高脚杯': '清新风格高脚杯，杯身透明，线条柔和，适合盛装清新类鸡尾酒',
    '玻璃花瓣杯': '杯身设计如花瓣般展开，造型优雅独特，充满艺术感',
    '阳光透光杯': '杯身薄透，阳光能透过杯壁，形成美丽的光影效果',

    // === 直身杯类 ===
    '柯林斯杯': '高挑细长直身杯，杯身修长线条流畅，适合盛装长饮鸡尾酒，通常搭配吸管',
    '高挑柯林斯杯加冰柱': '高挑细长柯林斯杯，杯中竖立着完整的透明冰柱，杯身修长线条流畅，适合长饮鸡尾酒',
    '高球杯': '标准直身圆筒形高球杯，容量适中，杯壁厚实，适合盛装带冰块的鸡尾酒',
    '高球杯加满冰': '直身圆筒形高球杯，杯中装满透明冰块，杯壁厚实有质感',
    '长饮直身杯': '适合长饮的直身杯，杯身高度适中，容量较大',
    '直身圆筒形': '简洁的直身圆筒形杯，杯壁垂直，无多余装饰',
    '平底直身水晶杯': '平底直身水晶杯，简约直线设计，无多余装饰，展现液体纯粹美感',
    '不锈钢直身杯': '不锈钢材质直身杯，金属质感冰冷，适合冰镇饮品',
    '玻璃试管杯': '试管形状玻璃杯，细长直身，造型独特有实验感',
    '冰点圆柱杯': '圆柱形杯身，专为冰镇饮品设计，杯壁厚实保温',

    // === 宽口杯类 ===
    '玛格丽特杯': '经典宽口浅底玛格丽特杯，杯口边缘通常附着盐边，呈倒锥形设计',
    '玛格丽特杯带盐边': '经典玛格丽特杯，杯口边缘均匀附着细腻盐边，杯身宽口浅底，呈倒锥形',
    '飓风杯': '大型飓风杯，杯身呈优雅的S形曲线，容量大，充满热带风情',
    '飓风杯热带果饰': '大容量飓风杯，杯身曲线优雅，杯口装饰着热带水果切片，充满度假风情',
    '飓风杯大口径': '大口径飓风杯，杯身宽阔，适合盛装色彩鲜艳的热带鸡尾酒',
    '飓风玻璃杯': '大型飓风玻璃杯，杯身呈优雅的S形曲线，容量大，适合盛装热带风情鸡尾酒',
    '宽口浅底': '宽口浅底杯型，杯口宽阔，杯身较浅，适合展现饮品色彩',

    // === 矮杯类 ===
    '古典杯': '经典矮胖古典杯，杯壁厚重，杯口宽阔，适合盛装加冰的烈酒',
    '厚底古典杯带冰球': '厚重古典杯，杯底特别加厚，内含完整的透明冰球，杯壁厚实有质感',
    '古典杯加冰球': '古典杯内盛装大块透明冰球，冰球缓慢融化稀释烈酒',
    '厚底黑调古典杯': '黑色调的厚底古典杯，杯身沉稳厚重，适合暗色调饮品',
    '岩石杯': '矮胖岩石杯，杯身厚重，适合盛装加冰的烈酒',
    '岩石杯哑光质感': '岩石杯采用哑光处理表面，质感温润不反光，适合手捧舒适持握',
    '岩石杯加厚底': '岩石杯底部特别加厚，增强稳定性和手感舒适度',
    '窄口深色岩石杯': '窄口设计的深色岩石杯，杯身厚重，口部收窄',
    '哑光矮脚杯': '哑光质感的矮脚杯，杯身温润不反光，手感舒适',
    '矮款水晶杯': '矮款水晶杯，杯身圆润，水晶材质通透',
    '薄款岩石杯': '杯壁较薄的岩石杯，重量较轻，适合手持',
    '矮脚杯': '简约矮脚杯，杯脚短小稳定，适合悠闲品饮时刻',
    '圆形矮脚杯': '圆形矮脚杯，杯身圆润，杯脚短小',
    '厚底古典杯': '底部特别加厚的古典杯，稳定性好，手感扎实',

    // === 特殊杯型 ===
    '子弹杯': '小巧子弹杯，杯身短小精悍，一口容量，适合盛装烈性短饮酒',
    '酸酒杯': '精致酸酒杯，杯身细长呈漏斗形，杯脚优雅，适合盛装酸类鸡尾酒',
    '冰爽酸酒杯': '专为酸类鸡尾酒设计的冰爽杯型，杯身细长，保持饮品低温',
    '利口酒杯': '小巧利口酒杯，杯身细长精致，容量小，适合盛装甜烈酒',
    '白兰地矮脚杯': '经典白兰地矮脚杯，杯身圆润杯脚短小，适合品鉴烈酒的香气',
    '白兰地郁金香杯': '白兰地专用郁金香杯，杯身优雅收口，能完美展现白兰地香气',
    '威士忌闻香杯': '威士忌专用闻香杯，杯身郁金香形收口，能聚集香气便于品鉴',
    '威士忌品鉴杯': '专业威士忌品鉴杯，杯身曲线优雅，适合细致品鉴威士忌风味',
    '啤酒杯带泡沫': '传统啤酒杯，杯身厚重带有手柄，顶部覆盖着细腻的白色泡沫层',
    '烈酒杯': '经典烈酒杯，小巧精致，适合一饮而尽的烈性短饮酒',
    '烈酒杯带棱角': '带棱角设计的烈酒杯，造型锐利，现代感强',
    '闻香杯': '专业闻香杯，杯口收窄设计，能有效聚集香气分子',
    '品鉴杯': '专业品鉴杯，设计科学，能完美展现酒体的色泽、香气和口感',
    '雪茄杯': '雪茄主题杯，杯身粗犷有棱角，适合搭配雪茄的烈性饮品',
    '彩虹杯': '创意彩虹杯，杯身设计独特，可能带有彩色装饰或特殊形状，充满趣味性',
    '锥形冷却杯': '锥形设计的冷却杯，杯身逐渐收窄，适合快速冷却饮品',
    '棱角水晶杯': '带棱角设计的水晶杯，切割面多，反光效果好',
    '冷水滴形杯': '水滴形状的杯子，造型流畅自然，充满设计感',
    '玻璃锥形杯': '锥形玻璃杯，杯口较大，杯底较小，适合分层饮品',
    '金属悬空杯': '金属材质悬空设计杯，现代感强烈，造型独特',
    '透明子弹杯': '透明材质子弹杯，小巧精致，可看到液体色泽',
    '极简方杯': '极简主义方杯，直线条设计，造型干净利落',
    '简约陶瓷杯': '简约风格陶瓷杯，材质温润，手感舒适',
    '磨砂玻璃矮杯': '磨砂玻璃材质矮杯，表面雾面处理，质感柔和',
    '手工陶艺杯': '手工制作的陶艺杯，每只都有独特纹理，充满艺术感',
    '木质纹理杯': '木质纹理装饰的杯子，自然风格浓厚',
    '柔和弧形杯': '杯身采用柔和弧形设计，线条流畅，手感舒适',
    '古朴陶瓷杯': '古朴风格的陶瓷杯，质感厚重，有历史感',
    '自然石纹杯': '仿自然石纹的杯子，质感独特，贴近自然',
    '手工玻璃杯': '手工吹制玻璃杯，每只都有独特气泡和纹理',
    '温暖陶杯': '温暖色调的陶杯，质感朴实，适合秋冬季节',
    '柔和线条杯': '线条柔和的杯子，造型温和，无尖锐棱角',
    '雾面古典杯': '雾面处理的古典杯，表面不反光，质感高级',
    '磨砂矮脚杯': '磨砂材质的矮脚杯，表面雾面，手感温润',
    '窄身细长杯': '窄身设计的细长杯，杯身修长，造型优雅',
    '灰色调岩石杯': '灰色调的岩石杯，色彩沉稳，适合冷色调饮品',
    '哑光质感杯': '哑光质感的杯子，表面无光泽，高级感强',
    '极简无装饰杯': '极简无装饰杯子，造型纯粹，突出饮品本身',
    '低调灰色杯': '低调灰色杯子，色彩中性，不抢眼',
    '薄雾玻璃杯': '薄雾效果玻璃杯，表面有轻微雾化，朦胧美感',
    '简约陶瓷杯': '简约风格陶瓷杯，造型简单，材质自然',
    '柔和曲线杯': '柔和曲线设计的杯子，线条流畅，手感舒适',
    '安静色调杯': '安静色调的杯子，色彩柔和，营造宁静氛围',
    '低饱和度杯': '低饱和度色彩的杯子，色彩温和不刺眼',
    '忧郁水晶杯': '忧郁色调的水晶杯，色彩深沉，质感高级',
    '伤感风格杯': '伤感风格的杯子，造型忧郁，色彩暗淡',
    '平静线条杯': '平静线条设计的杯子，造型稳定，无突兀元素',
    '透明玻璃杯': '透明玻璃杯，材质通透，可清晰看到液体',
    '浅绿水晶杯': '浅绿色调水晶杯，色彩清新，适合春季饮品',
    '治愈主题杯': '治愈主题设计的杯子，造型温和，色彩柔和',
    '自然风格杯': '自然风格杯子，采用自然元素设计，贴近大自然',

    // === 带装饰的杯子 ===
    '带盐边': '杯口边缘附着细腻盐边，增加口感层次和视觉效果',
    '带冰柱': '杯中竖立完整透明冰柱，缓慢融化保持饮品低温',
    '带泡沫': '顶部覆盖细腻白色泡沫层，口感绵密，视觉效果佳',
    '带细闪光泽': '杯身带有细闪光泽，光线照射下闪烁微光',
    '带金属镶边': '杯口边缘有金属镶边装饰，提升现代感和精致度',
    '带热带果饰': '杯口装饰热带水果切片，色彩鲜艳，充满度假风情',

    // 通用描述（如果未匹配到具体类型）
    'default': '精致玻璃杯，杯身线条流畅，玻璃材质通透，表面有柔和反光'
  };

  // 1. 首先尝试精确匹配
  if (glassDescriptions[glassType]) {
    return glassDescriptions[glassType];
  }

  // 2. 尝试包含匹配（酒杯类型包含关键词）
  for (const [key, description] of Object.entries(glassDescriptions)) {
    if (glassType.includes(key) && key.length > 1) {
      return description;
    }
  }

  // 3. 尝试关键词匹配
  const keywordMap = {
    '马天尼': '马天尼杯',
    '香槟': '香槟杯',
    '柯林斯': '柯林斯杯',
    '古典': '古典杯',
    '高球': '高球杯',
    '玛格丽特': '玛格丽特杯',
    '飓风': '飓风杯',
    '岩石': '岩石杯',
    '子弹': '子弹杯',
    '酸酒': '酸酒杯',
    '利口酒': '利口酒杯',
    '白兰地': '白兰地矮脚杯',
    '威士忌': '威士忌闻香杯',
    '啤酒': '啤酒杯带泡沫',
    '烈酒': '烈酒杯',
    '闻香': '闻香杯',
    '品鉴': '品鉴杯',
    '雪茄': '雪茄杯',
    '彩虹': '彩虹杯',
    '金属': '马天尼杯金属镶边',
    '水晶': '水晶马天尼杯带细闪光泽',
    '磨砂': '磨砂玻璃矮杯',
    '哑光': '哑光质感杯',
    '雾面': '雾面古典杯',
    '透明': '透明玻璃杯',
    '玻璃': '透明玻璃杯',
    '陶瓷': '简约陶瓷杯',
    '木质': '木质纹理杯'
  };

  for (const [keyword, glassKey] of Object.entries(keywordMap)) {
    if (glassType.includes(keyword)) {
      return glassDescriptions[glassKey] || glassDescriptions.default;
    }
  }

  // 4. 默认返回通用描述
  return glassDescriptions.default;
}

/**
 * 生成可灵API的图像生成prompt
 * 根据豆包API返回的鸡尾酒内容生成图像prompt
 * 增强版：增加酒杯详细描述，使生成的酒杯更贴合实际类型
 */
function generateKlingPrompt(cocktailData) {
  const {
    name,
    baseSpirit,
    ingredient1,
    ingredient2,
    glassType,
    color1,
    color2,
    glassDescription: providedGlassDescription
  } = cocktailData;

  // 获取酒杯详细描述：优先使用豆包API提供的描述，否则使用本地描述
  const glassDescription = providedGlassDescription && providedGlassDescription.trim()
    ? providedGlassDescription
    : getGlassDescription(glassType);

  const template = `【${name}】特写，图片比例3:4，8-bit复古像素艺术风格，经典像素画质感，像素块清晰分明，高对比度像素线条。

视觉焦点：${glassType}酒杯，${glassDescription}

杯中盛装${baseSpirit}、${ingredient1}切片和${ingredient2}装饰，液体表面带有像素冰块。

背景纯黑色，整体呈现强烈的赛博朋克氛围。${color1}为主色调，边缘散发荧光${color2}光晕，带有像素化的光斑和粒子特效。
画面中心聚焦，酒杯细节清晰，光影对比强烈，营造出酷炫、潮流且充满科技感的氛围。`;

  return template;
}

/**
 * 解析豆包API返回的鸡尾酒内容
 * 从AI响应中提取结构化数据
 */
function parseCocktailResponse(aiResponse) {
  console.log('🔍 解析AI响应:', aiResponse.substring(0, 200) + '...');

  const lines = aiResponse.split('\n').filter(line => line.trim());
  const result = {};

  // 尝试解析多种格式
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 格式1：酒名：【名称】
    if (line.includes('酒名：')) {
      // 尝试提取【】中的内容
      const nameMatch = line.match(/酒名：【(.*?)】/);
      if (nameMatch) {
        result.name = nameMatch[1];
      } else {
        result.name = line.replace('酒名：', '').replace(/【/g, '').replace(/】/g, '').trim();
      }
    }
    // 格式2：### 酒名：【名称】
    else if (line.startsWith('### 酒名：')) {
      const nameMatch = line.match(/### 酒名：【(.*?)】/);
      if (nameMatch) {
        result.name = nameMatch[1];
      } else {
        result.name = line.replace('### 酒名：', '').replace(/【/g, '').replace(/】/g, '').trim();
      }
    }
    // 基酒
    else if (line.includes('基酒：')) {
      const spiritMatch = line.match(/基酒：(.*)/);
      if (spiritMatch) {
        result.baseSpirit = spiritMatch[1].split('（')[0].trim();
      }
    }
    // 食材1
    else if (line.includes('食材1：')) {
      const match = line.match(/食材1：(.*)/);
      if (match) {
        result.ingredient1 = match[1].split('（')[0].trim();
      }
    }
    // 食材2
    else if (line.includes('食材2')) {
      const match = line.match(/食材2（装饰）：(.*)/);
      if (match) {
        result.ingredient2 = match[1].split('（')[0].trim();
      } else if (line.includes('食材2：')) {
        const match2 = line.match(/食材2：(.*)/);
        if (match2) {
          result.ingredient2 = match2[1].split('（')[0].trim();
        }
      }
    }
    // 酒精浓度
    else if (line.includes('酒精浓度：')) {
      const match = line.match(/酒精浓度：(\d+(?:\.\d+)?)%/);
      if (match) {
        result.alcoholContent = parseFloat(match[1]);
      }
    }
    // 酒杯类型
    else if (line.includes('酒杯类型：')) {
      result.glassType = line.replace(/### 酒杯类型：/, '').replace('酒杯类型：', '').trim();
    }
    // 酒杯描述 - 支持多行描述
    else if (line.includes('酒杯描述：')) {
      // 提取当前行的描述部分
      let description = line.replace(/### 酒杯描述：/, '').replace('酒杯描述：', '').trim();

      // 检查后续行是否也属于描述（直到遇到下一个字段或空行）
      let j = i + 1;
      while (j < lines.length && !lines[j].includes('：') && lines[j].trim() !== '') {
        description += ' ' + lines[j].trim();
        j++;
      }

      result.glassDescription = description.trim();
    }
    // 情绪文案
    else if (line.includes('情绪文案：')) {
      result.description = line.replace(/### 情绪文案：/, '').replace('情绪文案：', '').trim();
    }
    // 颜色1 - 十六进制颜色
    else if (line.includes('颜色1：')) {
      // 提取十六进制颜色代码
      const colorMatch = line.match(/#[0-9A-Fa-f]{6}/);
      if (colorMatch) {
        result.color1 = colorMatch[0];
      } else {
        result.color1 = line.replace('颜色1：', '').trim();
      }
    }
    // 颜色2 - 十六进制颜色
    else if (line.includes('颜色2：')) {
      const colorMatch = line.match(/#[0-9A-Fa-f]{6}/);
      if (colorMatch) {
        result.color2 = colorMatch[0];
      } else {
        result.color2 = line.replace('颜色2：', '').trim();
      }
    }
    // 氛围感配色（旧格式）
    else if (line.includes('氛围感配色：')) {
      const colors = line.replace(/### 氛围感配色：/, '').replace('氛围感配色：', '').trim();
      const colorList = colors.split(/[、,，]/).map(c => c.trim()).filter(c => c);
      if (colorList.length >= 2) {
        // 将中文颜色名称映射为十六进制（简化处理）
        result.color1 = mapChineseColorToHex(colorList[0]) || colorList[0];
        result.color2 = mapChineseColorToHex(colorList[1]) || colorList[1];
      }
    }
  }

  // 验证必要字段
  const required = ['name', 'baseSpirit', 'ingredient1', 'ingredient2', 'alcoholContent', 'glassType', 'description', 'color1', 'color2'];
  const missing = required.filter(field => !result[field]);

  if (missing.length > 0) {
    console.error('解析失败，缺少字段:', missing);
    console.error('当前解析结果:', result);
    throw new Error(`解析AI响应失败，缺少字段: ${missing.join(', ')}`);
  }

  // 转换为标准格式
  return {
    name: result.name,
    ingredients: [result.baseSpirit, result.ingredient1, result.ingredient2],
    alcoholContent: result.alcoholContent,
    glassType: result.glassType,
    glassDescription: result.glassDescription || '', // 酒杯描述（可能为空）
    description: result.description,
    color1: result.color1,
    color2: result.color2,
    // 原始解析结果
    raw: result
  };
}

/**
 * 将中文颜色名称映射为十六进制颜色代码（简化版）
 */
function mapChineseColorToHex(colorName) {
  const colorMap = {
    '柔雾樱粉': '#FFB6C1',
    '碎闪芋紫': '#9370DB',
    '樱粉': '#FFB6C1',
    '芋紫': '#9370DB',
    '粉色': '#FFC0CB',
    '紫色': '#800080',
    '蓝色': '#0000FF',
    '绿色': '#008000',
    '红色': '#FF0000',
    '橙色': '#FFA500',
    '黄色': '#FFFF00',
    '金色': '#FFD700',
    '琥珀色': '#D2691E',
    '棕色': '#8B4513',
    '灰色': '#808080',
    '黑色': '#000000',
    '白色': '#FFFFFF',
    '海绿色': '#2E8B57',
    '钢蓝色': '#4682B4',
    '橙红色': '#FF4500',
    '石板灰': '#708090',
    '浅绿': '#90EE90',
    '深蓝': '#00008B',
    '深紫': '#4B0082'
  };

  return colorMap[colorName] || null;
}

/**
 * 构建鸡尾酒数据对象用于API响应
 */
function buildCocktailData(mood, parsedData) {
  console.log('🔧 buildCocktailData调用:', { mood, parsedData });
  const { getMoodLabel } = require('../config/constants');

  return {
    id: `${mood}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: parsedData.name,
    description: parsedData.description,
    ingredients: parsedData.ingredients,
    alcoholContent: parsedData.alcoholContent,
    glassType: parsedData.glassType,
    glassDescription: parsedData.glassDescription || '', // 酒杯描述，可能为空
    color1: parsedData.color1,
    color2: parsedData.color2,
    imageUrl: null, // 将在图片生成完成后填充
    imageGenerationId: null, // 将在调用可灵API后填充
    mood: mood,
    moodLabel: getMoodLabel(mood),
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  generateDoubaoPrompt,
  generateKlingPrompt,
  parseCocktailResponse,
  buildCocktailData
};