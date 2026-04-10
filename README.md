# Mood Bar - 情绪特调鸡尾酒生成器

Mood Bar 是一款情绪调酒小工具。用户选择当日情绪，系统调用 AI 生成一杯专属的"情绪特饮"，以卡片形式展示，支持分享给好友，并可重新调制。整体风格为深夜酒吧风，复古、高级、温馨、治愈。

**Slogan**: Mood Bar・以情绪入酒

## ✨ 功能特性

- **情绪选择**: 选择当前情绪（开心、平静、忧郁、兴奋、疲惫、孤独等）
- **AI调酒生成**: 基于情绪生成专属鸡尾酒配方、名称、描述和图片
- **沉浸式体验**: 背景音乐、摇杯音效、旋转酒杯加载动画
- **精美分享**: 生成纯净质感海报，适配微信分享
- **重新调制**: 一键重新生成不同配方

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- TailwindCSS 样式框架
- 响应式设计（移动端优先）

### 后端
- Node.js + Express
- RESTful API 设计

### AI 集成
- **豆包大语言模型API**: 生成鸡尾酒配方、名称和描述
- **可灵图像生成API**: 生成鸡尾酒图片（可选）

### 部署
- 前端: Vercel / Netlify / GitHub Pages
- 后端: Heroku / Railway / Render / 腾讯云

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd mood_bar
   ```

2. **安装前端依赖**
   ```bash
   cd app
   npm install
   ```

3. **安装后端依赖**
   ```bash
   cd ../server
   npm install
   ```

4. **配置环境变量**
   - 复制 `server/.env.example` 为 `server/.env`
   - 填入豆包API密钥（必需）和可灵API密钥（可选）

   ```env
   # 豆包API配置
   DOUBAO_API_KEY=your_actual_doubao_api_key
   DOUBAO_API_URL=https://api.doubao.com/v1/chat/completions

   # 可灵API配置
   KLING_API_KEY=your_actual_kling_api_key
   KLING_API_URL=https://api.kling.ai/v1/images/generations

   # 服务器配置
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

5. **启动后端服务**
   ```bash
   cd server
   npm start
   ```

6. **启动前端开发服务器**
   ```bash
   cd app
   npm run dev
   ```

7. **访问应用**
   - 前端: http://localhost:5173
   - 后端API: http://localhost:3000

### 使用启动脚本
- Windows: 运行 `start.bat`
- Linux/Mac: 运行 `start.sh`

## 🔧 项目结构

```
mood_bar/
├── app/                    # React前端应用
│   ├── src/               # 源代码
│   │   ├── components/    # React组件
│   │   ├── hooks/         # 自定义Hooks
│   │   ├── services/      # API服务
│   │   └── types/         # TypeScript类型定义
│   ├── public/            # 静态资源
│   └── package.json       # 前端依赖
├── server/                # Node.js后端API
│   ├── src/              # 后端源码
│   ├── .env.example      # 环境变量模板
│   └── package.json      # 后端依赖
├── assets/               # 设计素材和图片
├── DEPLOYMENT.md         # 详细部署指南
├── README.md             # 项目说明（本文档）
└── .gitignore            # Git忽略配置
```

## 📝 API配置说明

### 豆包API（必需）
1. 访问 [豆包开放平台](https://console.doubao.com/)
2. 注册账号并创建应用
3. 获取API密钥
4. 充值额度（按量计费）

### 可灵API（可选）
1. 访问 [可灵开放平台](https://platform.kling.ai/)
2. 注册账号并创建应用
3. 获取API密钥
4. 充值额度（按量计费）

**注意**: 如果没有可灵API密钥，系统将使用模拟图片URL。

## 🌐 部署指南

详细部署步骤请参考 [DEPLOYMENT.md](DEPLOYMENT.md)

### 前端部署（Vercel示例）
```bash
cd app
npm run build
```
将 `app/dist` 目录部署到静态托管服务

### 后端部署（Railway示例）
1. 导入项目到 Railway
2. 设置环境变量
3. 部署应用

## 🎨 设计理念

- **深夜酒吧风**: 复古、高级、温馨的视觉风格
- **情绪治愈**: 诗意文案配合舒缓音乐，实现情绪安放
- **仪式感**: 模拟真实调酒流程，增强用户体验
- **分享友好**: 简洁美观的分享卡片，便于社交传播

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目仅供学习交流使用。

## 🙏 致谢

- 感谢豆包大语言模型提供AI能力
- 感谢可灵AI提供图像生成能力
- 感谢所有开源项目的贡献者

---

**温馨提示**: 请理性饮酒，享受情绪治愈的同时，注意身心健康。