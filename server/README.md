# Mood Bar 后端服务器

基于Node.js + Express的后端API服务器，为Mood Bar前端提供情绪鸡尾酒生成服务，集成豆包大语言模型API和可灵图像生成API。

## 功能特性

- **情绪鸡尾酒生成**：根据8种情绪词生成定制鸡尾酒配方
- **豆包API集成**：调用大语言模型生成酒名、配方、文案
- **可灵API集成**：生成像素艺术风格鸡尾酒图片
- **实时图片生成状态跟踪**：支持图片生成进度查询
- **跨域支持**：配置CORS允许前端应用访问

## 技术栈

- **Node.js**：运行时环境
- **Express**：Web框架
- **Axios**：HTTP客户端
- **dotenv**：环境变量管理
- **CORS**：跨域资源共享

## 项目结构

```
server/
├── src/
│   ├── config/           # 配置文件
│   │   ├── index.js      # 环境变量配置
│   │   └── constants.js  # 情绪映射表
│   ├── services/         # 业务服务
│   │   ├── doubao.js     # 豆包API服务
│   │   ├── kling.js      # 可灵API服务
│   │   └── prompt.js     # prompt模板管理
│   ├── controllers/      # 控制器
│   │   └── cocktail.js   # 鸡尾酒生成控制器
│   ├── routes/          # 路由
│   │   └── api.js       # API路由
│   ├── middleware/      # 中间件
│   │   └── cors.js      # CORS配置
│   └── server.js        # 服务器入口
├── .env.example         # 环境变量示例
├── package.json
└── README.md
```

## API接口

### 1. 生成鸡尾酒
**POST** `/api/generate-cocktail`

请求体：
```json
{
  "mood": "happy",
  "moodLabel": "开心愉悦"
}
```

响应体：
```json
{
  "success": true,
  "data": {
    "id": "happy-1743765420000-abc123",
    "name": "落日微醺金酒",
    "description": "落日橙与玫瑰盐，敬今日的微醺浪漫",
    "ingredients": ["金酒", "西柚汁", "玫瑰糖浆"],
    "alcoholContent": 8,
    "glassType": "马天尼杯",
    "color1": "#FF6B9D",
    "color2": "#9D4EDD",
    "imageUrl": "https://example.com/generated-image.jpg",
    "imageGenerationId": "img-123456",
    "mood": "happy"
  }
}
```

### 2. 图片生成状态
**GET** `/api/image-status/:generationId`

响应体：
```json
{
  "success": true,
  "status": "completed",
  "imageUrl": "https://example.com/generated-image.jpg"
}
```

## 安装和运行

### 1. 安装依赖
```bash
cd server
npm install
```

### 2. 配置环境变量
复制`.env.example`为`.env`并填写实际的API密钥：
```bash
cp .env.example .env
```

### 3. 开发环境运行
```bash
npm run dev
```

### 4. 生产环境运行
```bash
npm start
```

## 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| DOUBAO_API_KEY | 豆包API密钥 | your_doubao_api_key |
| DOUBAO_API_URL | 豆包API地址 | https://api.doubao.com/v1/chat/completions |
| KLING_API_KEY | 可灵API密钥 | your_kling_api_key |
| KLING_API_URL | 可灵API地址 | https://api.kling.ai/v1/images/generations |
| PORT | 服务器端口 | 3000 |
| CORS_ORIGIN | 允许的跨域来源 | http://localhost:5173,https://your-vercel-app.vercel.app |

## 部署

### Vercel 部署
配置`vercel.json`：
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/src/server.js" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 传统服务器部署
1. 设置环境变量
2. 运行 `npm install --production`
3. 使用PM2或systemd管理进程

## 开发指南

### 添加新情绪
1. 在 `src/config/constants.js` 中添加新的情绪映射
2. 更新前端情绪选择按钮
3. 测试生成流程

### 自定义prompt模板
修改 `src/services/prompt.js` 中的模板内容

### 调试
启用调试模式：
```bash
DEBUG=mood-bar:* npm run dev
```

## 许可证

MIT License