/**
 * 收集所有酒杯类型
 */

const { moodMapping } = require('./src/config/constants');

console.log('收集所有酒杯类型...\n');

const allGlassTypes = new Set();
const moodGlassMap = {};

Object.entries(moodMapping).forEach(([mood, config]) => {
  const glasses = config.glassTypes;
  moodGlassMap[mood] = glasses.map(g => typeof g === 'string' ? g : g.name);
  glasses.forEach(g => {
    const name = typeof g === 'string' ? g : g.name;
    allGlassTypes.add(name);
  });
});

console.log(`总共 ${allGlassTypes.size} 种唯一酒杯类型:\n`);
Array.from(allGlassTypes).sort().forEach((name, i) => {
  console.log(`${i+1}. ${name}`);
});

// 检查哪些酒杯类型可能缺少描述
console.log('\n\n检查酒杯类型格式:');
Object.entries(moodMapping).forEach(([mood, config]) => {
  const hasObjects = config.glassTypes.some(g => typeof g === 'object');
  const hasStrings = config.glassTypes.some(g => typeof g === 'string');
  console.log(`${mood}: ${hasObjects ? '对象' : ''}${hasObjects && hasStrings ? '+' : ''}${hasStrings ? '字符串' : ''} (${config.glassTypes.length}种)`);
});