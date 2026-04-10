/**
 * 选择历史缓存（用于轮换机制，避免短期重复）
 */
const selectionHistory = {
  baseSpirit: {}, // mood -> [最近选择的索引]
  glassType: {}   // mood -> [最近选择的索引]
};

/**
 * 情绪-风格映射表
 * 定义8种情绪对应的风格、基酒、口感、酒杯类型等属性
 */
const moodMapping = {
  happy: {
    label: '开心愉悦',
    style: '透明高脚杯，粉紫渐变液体，顶部轻盈气泡与细碎金箔，明亮侧光，派对光斑背景，活泼通透质感',
    baseSpirits: ['金酒', '白朗姆酒', '伏特加', '白兰地', '龙舌兰', '威士忌', '香槟', '起泡酒', '甜葡萄酒', '果味利口酒'],
    taste: '甜香清爽，带气泡感，果味明亮，液体轻盈透亮',
    glassTypes: [
      {
        name: '水晶马天尼杯带细闪光泽',
        visualDesc: '高挑锥形水晶杯，杯身带有细闪光泽，杯口边缘有轻微反光，杯壁薄透，适合盛装透明或浅色鸡尾酒',
        shape: '锥形',
        material: '水晶透明',
        decoration: '细闪光泽',
        lighting: '高光反射',
        special: '反光闪烁'
      },
      {
        name: '香槟杯配气泡泡沫',
        visualDesc: '细长郁金香形香槟杯，杯底有持续上升的细小气泡，顶部形成细腻持久的泡沫层，杯脚细长优雅',
        shape: '郁金香形',
        material: '玻璃通透',
        decoration: '气泡泡沫',
        lighting: '通透透光',
        special: '气泡上升'
      },
      {
        name: '高挑柯林斯杯加冰柱',
        visualDesc: '高挑细长柯林斯杯，杯中竖立着完整的透明冰柱，杯身修长线条流畅，适合长饮鸡尾酒',
        shape: '高挑细长',
        material: '玻璃',
        decoration: '冰柱',
        lighting: '通透感',
        special: '冰晶效果'
      },
      {
        name: '蝶形香槟杯',
        visualDesc: '经典蝶形香槟杯，杯口宽阔呈蝶翼状展开，杯身浅而宽，适合展现气泡上升的美感',
        shape: '蝶形展开',
        material: '水晶',
        decoration: '简约设计',
        lighting: '高光反射',
        special: '气泡动态'
      },
      {
        name: '玛格丽特杯带盐边',
        visualDesc: '经典玛格丽特杯，杯口边缘均匀附着细腻盐边，杯身宽口浅底，呈倒锥形',
        shape: '宽口浅底',
        material: '玻璃',
        decoration: '盐边装饰',
        lighting: '柔和反光',
        special: '盐霜质感'
      },
      {
        name: '飓风杯热带果饰',
        visualDesc: '大容量飓风杯，杯身曲线优雅，杯口装饰着热带水果切片，充满度假风情',
        shape: '曲线优雅',
        material: '玻璃',
        decoration: '热带水果装饰',
        lighting: '阳光感',
        special: '色彩鲜艳'
      },
      {
        name: '高球杯',
        visualDesc: '标准高球杯，直身圆筒形，容量适中，杯壁厚实，适合盛装带冰块的鸡尾酒',
        shape: '直身圆筒形',
        material: '厚玻璃',
        decoration: '简约无饰',
        lighting: '柔和光线',
        special: '冰块悬浮'
      },
      {
        name: '古典杯',
        visualDesc: '经典古典杯，矮胖圆润，杯壁厚重，杯口宽阔，适合盛装加冰的烈酒',
        shape: '矮胖圆润',
        material: '厚重玻璃',
        decoration: '简约设计',
        lighting: '温暖光线',
        special: '冰球效果'
      },
      {
        name: '酸酒杯',
        visualDesc: '精致酸酒杯，杯身细长呈漏斗形，杯脚优雅，适合盛装酸类鸡尾酒',
        shape: '漏斗形',
        material: '玻璃',
        decoration: '简约线条',
        lighting: '通透感',
        special: '液体分层'
      },
      {
        name: '子弹杯',
        visualDesc: '小巧子弹杯，杯身短小精悍，一口容量，适合盛装烈性短饮酒',
        shape: '短小圆柱形',
        material: '玻璃或金属',
        decoration: '简约设计',
        lighting: '锐利反光',
        special: '一饮而尽感'
      },
      {
        name: '飓风玻璃杯',
        visualDesc: '大型飓风玻璃杯，杯身呈优雅的S形曲线，容量大，适合盛装热带风情鸡尾酒',
        shape: 'S形曲线',
        material: '玻璃',
        decoration: '简约造型',
        lighting: '通透感',
        special: '分层效果'
      },
      {
        name: '啤酒杯带泡沫',
        visualDesc: '传统啤酒杯，杯身厚重带有手柄，顶部覆盖着细腻的白色泡沫层',
        shape: '带手柄圆柱形',
        material: '玻璃或陶瓷',
        decoration: '泡沫层',
        lighting: '柔和光线',
        special: '泡沫质感'
      },
      {
        name: '利口酒杯',
        visualDesc: '小巧利口酒杯，杯身细长精致，容量小，适合盛装甜烈酒',
        shape: '细长精致',
        material: '玻璃',
        decoration: '精致设计',
        lighting: '通透感',
        special: '甜酒光泽'
      },
      {
        name: '彩虹杯',
        visualDesc: '创意彩虹杯，杯身设计独特，可能带有彩色装饰或特殊形状，充满趣味性',
        shape: '独特创意',
        material: '玻璃',
        decoration: '彩色装饰',
        lighting: '多彩反光',
        special: '彩虹效果'
      },
      {
        name: '鸡尾酒杯',
        visualDesc: '经典鸡尾酒杯，细长杯脚搭配锥形杯身，造型优雅，适合盛装短饮酒',
        shape: '锥形带长脚',
        material: '玻璃',
        decoration: '经典设计',
        lighting: '优雅反光',
        special: '精致感'
      }
    ],
    colorPalette: ['#FF6B9D', '#9D4EDD', '#FFD700', '#FF9E6D', '#FF1493', '#DA70D6', '#FF69B4', '#FFB6C1', '#FFC0CB', '#DB7093'],
    keywords: ['气泡', '金箔', '水果切片', '光斑', '亮面反光', '透明冰块', '鲜花装饰', '明亮光影', '糖边', '星星糖', '彩色糖粒', '花瓣', '亮片', '彩虹渐变', '派对彩带', '生日蜡烛', '笑脸装饰', '气球图案']
  },

  tired: {
    label: '疲惫倦怠',
    style: '暖调琥珀色液体，缓慢流动质感，杯壁凝雾，柔和暖光低饱和，深夜桌面静谧氛围，木质背景',
    baseSpirits: ['苏格兰威士忌', '白兰地', '波本威士忌', '爱尔兰威士忌', '加拿大威士忌', '黑麦威士忌', '陈年白兰地', '阿马尼亚克', '卡尔瓦多斯', '陈年朗姆酒'],
    taste: '醇厚顺滑，微苦回甘，酒体浓稠有挂杯',
    glassTypes: [
      {
        name: '厚底古典杯带冰球',
        visualDesc: '厚重古典杯，杯底特别加厚，内含完整的透明冰球，杯壁厚实有质感',
        shape: '矮胖圆润',
        material: '厚重玻璃',
        decoration: '冰球',
        lighting: '柔和漫射',
        special: '冰球质感'
      },
      {
        name: '岩石杯哑光质感',
        visualDesc: '岩石杯采用哑光处理表面，质感温润不反光，适合手捧舒适持握',
        shape: '矮胖岩石形',
        material: '磨砂玻璃',
        decoration: '哑光表面',
        lighting: '雾面散射',
        special: '温润质感'
      },
      {
        name: '白兰地矮脚杯',
        visualDesc: '经典白兰地矮脚杯，杯身圆润杯脚短小，适合品鉴烈酒的香气',
        shape: '圆润矮脚',
        material: '水晶',
        decoration: '简约设计',
        lighting: '柔和光线',
        special: '闻香聚拢'
      },
      {
        name: '威士忌闻香杯',
        visualDesc: '威士忌专用闻香杯，杯身郁金香形收口，能聚集香气便于品鉴',
        shape: '郁金香形收口',
        material: '玻璃',
        decoration: '专业设计',
        lighting: '通透感',
        special: '香气聚集'
      },
      {
        name: '平底直身水晶杯',
        visualDesc: '平底直身水晶杯，简约直线设计，无多余装饰，展现液体纯粹美感',
        shape: '直身圆柱形',
        material: '水晶透明',
        decoration: '简约无饰',
        lighting: '通透透光',
        special: '纯净感'
      },
      {
        name: '复古陶质感杯',
        visualDesc: '复古风格陶质杯，表面有不规则手工痕迹，质感古朴温暖',
        shape: '不规则手工形',
        material: '陶瓷',
        decoration: '手工痕迹',
        lighting: '柔和漫射',
        special: '复古质感'
      },
      {
        name: '矮脚杯',
        visualDesc: '简约矮脚杯，杯脚短小稳定，适合悠闲品饮时刻',
        shape: '矮小稳定',
        material: '玻璃',
        decoration: '简约设计',
        lighting: '柔和光线',
        special: '稳定感'
      },
      {
        name: '闻香杯',
        visualDesc: '专业闻香杯，杯口收窄设计，能有效聚集香气分子',
        shape: '收口设计',
        material: '玻璃',
        decoration: '专业造型',
        lighting: '通透感',
        special: '香气体验'
      },
      {
        name: '品鉴杯',
        visualDesc: '专业品鉴杯，设计科学，能完美展现酒体的色泽、香气和口感',
        shape: '科学曲线',
        material: '水晶',
        decoration: '专业设计',
        lighting: '理想光线',
        special: '品鉴体验'
      },
      {
        name: '雪茄杯',
        visualDesc: '雪茄主题杯，杯身粗犷有棱角，适合搭配雪茄的烈性饮品',
        shape: '粗犷棱角',
        material: '厚重玻璃',
        decoration: '粗犷设计',
        lighting: '锐利阴影',
        special: '搭配感'
      },
      {
        name: '古典杯加冰球',
        visualDesc: '古典杯内盛装大块透明冰球，冰球缓慢融化稀释烈酒',
        shape: '矮胖古典',
        material: '厚玻璃',
        decoration: '冰球',
        lighting: '温暖光线',
        special: '慢融体验'
      },
      {
        name: '岩石杯加厚底',
        visualDesc: '岩石杯底部特别加厚，增强稳定性和手感舒适度',
        shape: '厚底岩石形',
        material: '厚重磨砂',
        decoration: '加厚设计',
        lighting: '雾面质感',
        special: '舒适握感'
      },
      {
        name: '威士忌品鉴杯',
        visualDesc: '专业威士忌品鉴杯，杯身曲线优雅，适合细致品鉴威士忌风味',
        shape: '优雅曲线',
        material: '水晶',
        decoration: '专业设计',
        lighting: '理想光线',
        special: '风味展现'
      },
      {
        name: '白兰地郁金香杯',
        visualDesc: '白兰地专用郁金香杯，杯身优雅收口，能完美展现白兰地香气',
        shape: '郁金香形',
        material: '水晶',
        decoration: '优雅设计',
        lighting: '柔和反光',
        special: '香气演化'
      },
      {
        name: '烈酒杯',
        visualDesc: '经典烈酒杯，小巧精致，适合一饮而尽的烈性短饮酒',
        shape: '小巧圆柱',
        material: '玻璃或金属',
        decoration: '简约设计',
        lighting: '锐利反光',
        special: '一饮而尽'
      }
    ],
    colorPalette: ['#D2691E', '#8B4513', '#A0522D', '#CD853F', '#8B0000', '#A52A2A', '#D2691E', '#CD853F', '#D2B48C', '#F4A460'],
    keywords: ['冰球', '杯壁凝水', '暖光', '木质桌面', '肉桂棒', '烟雾轻绕', '柔和阴影', '深夜氛围', '温暖炉火', '毛毯', '壁炉', '深夜读物', '咖啡豆', '巧克力片', '威士忌石', '皮革沙发', '羊毛毯', '烛光']
  },

  anxious: {
    label: '焦虑烦躁',
    style: '冷调蓝绿色通透液体，冰爽清冽质感，强光冷白光，金属杯沿反光，干净极简背景，镇静氛围',
    baseSpirits: ['白龙舌兰', '伏特加', '干金酒', '银色龙舌兰', '杜松子酒', '伏特加酒', '白兰地酒', '金朗姆酒', '白葡萄酒', '苏打水'],
    taste: '清冽微酸，冰感强烈，口感干净利落',
    glassTypes: [
      '马天尼杯金属镶边',
      '冰爽酸酒杯',
      '小高脚透明杯',
      '长饮直身杯',
      '烈酒杯带棱角',
      '锥形冷却杯',
      '不锈钢直身杯',
      '玻璃试管杯',
      '棱角水晶杯',
      '冷水滴形杯',
      '玻璃锥形杯',
      '金属悬空杯',
      '透明子弹杯',
      '冰点圆柱杯',
      '极简方杯'
    ],
    colorPalette: ['#2E8B57', '#20B2AA', '#4682B4', '#5F9EA0', '#00CED1', '#48D1CC', '#66CDAA', '#8FBC8F', '#00BFFF', '#1E90FF'],
    keywords: ['碎冰', '冷光', '薄荷装饰', '金属反光', '通透液体', '极简背景', '清凉雾气', '棱角杯型', '冰晶', '冷金属', '清透感', '冷静色', '锋利线条', '冷色调', '凝固感', '冰冻效果', '金属质感', '冷峻光影', '冷静氛围', '镇定元素']
  },

  calm: {
    label: '平静松弛',
    style: '大地色系柔和液体，自然柔光，雾面朦胧质感，慢生活氛围，浅景深，自然植物背景',
    baseSpirits: ['纯麦威士忌', '干邑白兰地', '黑朗姆', '苏格兰威士忌', '爱尔兰威士忌', '波本威士忌', '白兰地', '陈年朗姆酒', '龙舌兰', '金酒'],
    taste: '柔和平衡，淡雅回甘，层次温润',
    glassTypes: [
      '古典品鉴杯',
      '矮款水晶杯',
      '薄款岩石杯',
      '白兰地郁金香杯',
      '简约陶瓷杯',
      '磨砂玻璃矮杯',
      '圆形矮脚杯',
      '手工陶艺杯',
      '木质纹理杯',
      '柔和弧形杯',
      '古朴陶瓷杯',
      '自然石纹杯',
      '手工玻璃杯',
      '温暖陶杯',
      '柔和线条杯'
    ],
    colorPalette: ['#8FBC8F', '#D2B48C', '#BC8F8F', '#DEB887', '#F5DEB3', '#DAA520', '#BDB76B', '#CD853F', '#A0522D', '#8B7355'],
    keywords: ['自然光影', '薄荷叶', '浅景深', '柔和渐变', '木质托盘', '安静氛围', '温润光泽', '极简装饰', '阳光斑点', '自然纹理', '柔和阴影', '温暖色调', '安静角落', '缓慢节奏', '呼吸感', '宁静时刻', '冥想氛围', '舒适空间', '自然材质', '平和光线']
  },

  lonely: {
    label: '孤独emo',
    style: '深蓝紫色暗调液体，深邃神秘，弱光氛围，杯身厚重，孤独桌面视角，暗黑色背景',
    baseSpirits: ['波本威士忌', '陈酿白兰地', '陈酿龙舌兰', '黑麦威士忌', '苏格兰威士忌', '爱尔兰威士忌', '白兰地', '威士忌', '朗姆酒', '金酒'],
    taste: '浓郁深沉，口感厚重，余味绵长',
    glassTypes: [
      '厚底黑调古典杯',
      '窄口深色岩石杯',
      '哑光矮脚杯',
      '厚重水晶杯',
      '雾面暗黑杯',
      '小容量沉思杯',
      '黑色陶土杯',
      '深色玻璃杯',
      '沉重厚底杯',
      '低调无光杯',
      '小型烈酒杯',
      '深色金属杯',
      '暗色调岩石杯',
      '黑夜色陶杯',
      '忧郁色调杯'
    ],
    colorPalette: ['#4B0082', '#483D8B', '#6A5ACD', '#9370DB', '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#DDA0DD', '#EE82EE'],
    keywords: ['微弱侧光', '深色液体', '孤独氛围', '极简阴影', '无多余装饰', '深夜独处', '厚重玻璃', '低调反光', '单人角落', '深夜沉思', '安静时刻', '寂寞氛围', '黑暗角落', '独自空间', '影子轮廓', '低照明度', '深邃颜色', '暗色背景', '忧郁光影', '寂静环境']
  },

  energetic: {
    label: '元气满满',
    style: '鲜艳橙红色高饱和液体，动感飞溅效果，强光高亮，充满活力，热带水果装饰，运动阳光氛围',
    baseSpirits: ['伏特加', '金朗姆', '干金酒', '白龙舌兰', '白兰地', '白葡萄酒', '起泡酒', '果味伏特加', '柠檬伏特加', '水果金酒'],
    taste: '劲爽刺激，果香炸裂，气泡感足',
    glassTypes: [
      '高挑柯林斯杯',
      '高球杯加满冰',
      '飓风杯大口径',
      '长饮果汁杯',
      '亮面金属杯',
      '啤酒杯带泡沫',
      '大容量玻璃杯',
      '彩色塑料杯',
      '运动水壶杯',
      '户外露营杯',
      '派对主题杯',
      '活力马克杯',
      '炫彩鸡尾酒杯',
      '能量饮料杯',
      '闪亮高脚杯'
    ],
    colorPalette: ['#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF0000', '#FF69B4', '#FF1493', '#FF6347', '#FF7F50', '#FFA500'],
    keywords: ['液体飞溅', '碎冰堆叠', '水果片', '高亮反光', '活力光影', '吸管装饰', '阳光直射', '鲜艳撞色', '动态效果', '跳跃气泡', '色彩斑斓', '热带风情', '活力四射', '运动氛围', '激情瞬间', '闪光灯效', '霓虹色彩', '派对元素', '动感线条', '能量光芒']
  },

  sad: {
    label: '难过低落',
    style: '灰蓝色低饱和液体，雾面朦胧质感，柔和冷调弱光，安静伤感氛围，简约干净背景',
    baseSpirits: ['调和威士忌', '白兰地', '龙舌兰', '苏格兰威士忌', '爱尔兰威士忌', '黑麦威士忌', '伏特加', '金酒', '朗姆酒', '陈年白兰地'],
    taste: '微苦深沉，顺滑柔和，淡淡回甘',
    glassTypes: [
      '雾面古典杯',
      '磨砂矮脚杯',
      '窄身细长杯',
      '灰色调岩石杯',
      '哑光质感杯',
      '极简无装饰杯',
      '低调灰色杯',
      '薄雾玻璃杯',
      '简约陶瓷杯',
      '柔和曲线杯',
      '安静色调杯',
      '低饱和度杯',
      '忧郁水晶杯',
      '伤感风格杯',
      '平静线条杯'
    ],
    colorPalette: ['#708090', '#778899', '#B0C4DE', '#C0C0C0', '#808080', '#A9A9A9', '#D3D3D3', '#696969', '#778899', '#B0C4DE'],
    keywords: ['低饱和', '雾面质感', '柔和阴影', '安静氛围', '淡淡雾气', '简约装饰', '冷调微光', '沉静液体', '忧郁色调', '安静角落', '悲伤时刻', '灰色调', '温柔光线', '安静沉思', '轻柔氛围', '伤感情绪', '低调色彩', '平静空间', '温柔阴影', '暗淡光影']
  },

  healing: {
    label: '治愈放空',
    style: '清新嫩绿色通透液体，自然柔光，浅淡草木香气视觉，温柔治愈氛围，白色简约背景',
    baseSpirits: ['干金酒', '白朗姆', '伏特加', '白葡萄酒', '起泡酒', '果味金酒', '薄荷酒', '柠檬酒', '花草茶酒', '清酒'],
    taste: '清淡微甜，草木清香，口感干净柔和',
    glassTypes: [
      '透明水晶柯林斯杯',
      '浅口果酒杯',
      '细脚马天尼杯',
      '清新玻璃高脚杯',
      '薄透玻璃小杯',
      '简约无柄杯',
      '透明玻璃杯',
      '浅绿水晶杯',
      '柔和弧形杯',
      '自然纹理杯',
      '清新色彩杯',
      '治愈主题杯',
      '玻璃花瓣杯',
      '阳光透光杯',
      '自然风格杯'
    ],
    colorPalette: ['#98FB98', '#90EE90', '#3CB371', '#2E8B57', '#00FA9A', '#00FF7F', '#7CFC00', '#32CD32', '#6B8E23', '#556B2F'],
    keywords: ['清新绿植', '通透液体', '柔光', '干净背景', '薄冰', '淡雅花香', '治愈光泽', '自然明亮', '阳光透射', '自然呼吸', '清新空气', '温柔治愈', '放松氛围', '安静空间', '自然元素', '柔和色彩', '温暖光线', '治愈时刻', '平静心情', '自然疗愈']
  }
};

/**
 * 情绪强度映射（用于加权随机选择）
 */
const moodIntensity = {
  happy: 'medium',
  tired: 'medium',
  anxious: 'high',
  calm: 'low',
  lonely: 'medium',
  energetic: 'high',
  sad: 'medium',
  healing: 'low'
};

/**
 * 验证情绪类型是否有效
 */
function isValidMood(mood) {
  return Object.keys(moodMapping).includes(mood);
}

/**
 * 获取情绪的中文标签
 */
function getMoodLabel(mood) {
  return moodMapping[mood]?.label || mood;
}

/**
 * 获取情绪的完整配置
 */
function getMoodConfig(mood) {
  if (!isValidMood(mood)) {
    throw new Error(`无效的情绪类型: ${mood}`);
  }
  return moodMapping[mood];
}

/**
 * 随机选择基酒（带轮换机制，避免短期重复）
 */
function getRandomBaseSpirit(mood) {
  const config = getMoodConfig(mood);
  const spirits = config.baseSpirits;

  // 获取该情绪的最近选择历史
  if (!selectionHistory.baseSpirit[mood]) {
    selectionHistory.baseSpirit[mood] = [];
  }
  const recentSelections = selectionHistory.baseSpirit[mood];

  // 排除最近选择的2个基酒（如果列表足够长）
  const availableIndices = spirits
    .map((_, index) => index)
    .filter(index => !recentSelections.includes(index));

  let selectedIndex;
  if (availableIndices.length > 0) {
    // 从可用索引中随机选择
    selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  } else {
    // 如果全部都被最近选择过，则从全部中随机选择
    selectedIndex = Math.floor(Math.random() * spirits.length);
  }

  // 更新选择历史（保留最近2个选择）
  recentSelections.unshift(selectedIndex);
  if (recentSelections.length > 2) {
    recentSelections.pop();
  }
  selectionHistory.baseSpirit[mood] = recentSelections;

  return spirits[selectedIndex];
}

/**
 * 随机选择酒杯类型（带轮换机制，避免短期重复）
 */
function getRandomGlassType(mood) {
  const config = getMoodConfig(mood);
  const glasses = config.glassTypes;

  // 获取该情绪的最近选择历史
  if (!selectionHistory.glassType[mood]) {
    selectionHistory.glassType[mood] = [];
  }
  const recentSelections = selectionHistory.glassType[mood];

  // 排除最近选择的2个酒杯（如果列表足够长）
  const availableIndices = glasses
    .map((_, index) => index)
    .filter(index => !recentSelections.includes(index));

  let selectedIndex;
  if (availableIndices.length > 0) {
    // 从可用索引中随机选择
    selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  } else {
    // 如果全部都被最近选择过，则从全部中随机选择
    selectedIndex = Math.floor(Math.random() * glasses.length);
  }

  // 更新选择历史（保留最近2个选择）
  recentSelections.unshift(selectedIndex);
  if (recentSelections.length > 2) {
    recentSelections.pop();
  }
  selectionHistory.glassType[mood] = recentSelections;

  // 返回酒杯名称（字符串），保持向后兼容
  const glassItem = glasses[selectedIndex];
  return typeof glassItem === 'string' ? glassItem : glassItem.name;
}

/**
 * 随机选择颜色
 */
function getRandomColors(mood, count = 2) {
  const config = getMoodConfig(mood);
  const colors = [...config.colorPalette];
  const selected = [];

  for (let i = 0; i < count && colors.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    selected.push(colors.splice(randomIndex, 1)[0]);
  }

  return selected;
}

module.exports = {
  moodMapping,
  isValidMood,
  getMoodLabel,
  getMoodConfig,
  getRandomBaseSpirit,
  getRandomGlassType,
  getRandomColors
};