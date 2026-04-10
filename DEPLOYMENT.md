# Mood Bar 项目部署指南

## 项目结构

- **前端**：React + TypeScript + Vite + TailwindCSS
- **后端**：Node.js + Express
- **AI服务**：豆包大语言模型API、可灵图像生成API

## 环境要求

### 开发环境
- Node.js 18+ 和 npm
- API密钥：豆包API密钥、可灵API密钥（可选，支持模拟模式）

### 生产环境
- 前端托管：Vercel、Netlify、GitHub Pages
- 后端托管：Heroku、腾讯云、阿里云、Railway、Render
- 域名（可选）

## 部署步骤

### 1. 获取API密钥

#### 豆包API
1. 访问 [豆包开放平台](https://console.doubao.com/)
2. 注册账号并创建应用
3. 获取API密钥
4. 充值额度（按量计费）

#### 可灵API  
1. 访问 [可灵开放平台](https://platform.kling.ai/)
2. 注册账号并创建应用
3. 获取API密钥
4. 充值额度（按量计费）

### 2. 后端部署

#### 环境变量配置
在服务器上创建 `.env` 文件，内容参考 `server/.env.example`：

```bash
# 豆包API配置
DOUBAO_API_KEY=your_actual_doubao_api_key
DOUBAO_API_URL=https://api.doubao.com/v1/chat/completions

# 可灵API配置
KLING_API_KEY=your_actual_kling_api_key
KLING_API_URL=https://api.kling.ai/v1/images/generations

# 服务器配置
PORT=3000
NODE_ENV=production

# CORS配置（根据前端部署地址修改）
CORS_ORIGIN=https://your-frontend-domain.com

# 可选：缓存配置
CACHE_ENABLED=true
CACHE_TTL=3600
```

#### 部署到Heroku（示例）
```bash
# 进入后端目录
cd server

# 创建Heroku应用
heroku create your-mood-bar-api

# 设置环境变量
heroku config:set DOUBAO_API_KEY=your_key
heroku config:set KLING_API_KEY=your_key
heroku config:set NODE_ENV=production

# 部署
git push heroku main
```

#### 部署到腾讯云/阿里云
1. 购买云服务器（推荐1核2G以上配置）
2. 安装Node.js环境
3. 克隆项目代码
4. 配置PM2进程管理：
   ```bash
   npm install -g pm2
   cd server
   npm install --production
   pm2 start src/server.js --name mood-bar-api
   pm2 save
   pm2 startup
   ```
5. 配置Nginx反向代理（可选）

### 3. 前端部署

#### 环境变量配置
创建 `.env.production` 文件，内容参考 `app/.env.example`：

```bash
# 后端API基础URL（替换为实际后端地址）
VITE_API_BASE_URL=https://your-api-domain.com
```

#### 构建前端
```bash
cd app
npm install
npm run build
```

#### 部署到Vercel（推荐）
1. 导入GitHub仓库
2. 选择前端目录 `app`
3. 配置环境变量：
   - `VITE_API_BASE_URL`: 你的后端API地址
4. 点击部署

#### 部署到GitHub Pages
```bash
# 修改vite.config.ts中的base路径
# 执行构建
npm run build

# 部署到gh-pages分支
npm install gh-pages --save-dev
# 添加部署脚本到package.json
```

### 4. 域名配置（可选）

#### 配置自定义域名
1. 在域名服务商添加CNAME记录
2. 在托管平台绑定域名
3. 配置SSL证书（Vercel/Heroku自动提供）

## 开发环境配置

### 本地运行
1. 启动后端：
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. 启动前端：
   ```bash
   cd app
   npm install
   npm run dev
   ```

3. 访问前端：http://localhost:5173

### 模拟模式
如果不配置API密钥，系统将使用模拟模式：
- 豆包API：返回模拟的鸡尾酒配方
- 可灵API：返回Unsplash示例图片

## 故障排除

### 常见问题

#### 1. CORS错误
- 检查后端CORS_ORIGIN配置是否包含前端地址
- 确保协议（http/https）匹配

#### 2. API密钥无效
- 确认API密钥是否正确
- 检查账户余额是否充足
- 验证API服务区域限制

#### 3. 图片生成失败
- 检查可灵API密钥和额度
- 查看图片生成任务状态
- 确认prompt内容符合可灵要求

#### 4. 前端无法连接后端
- 检查VITE_API_BASE_URL配置
- 确认后端服务正在运行
- 查看网络请求控制台错误

### 日志查看

#### 后端日志
```bash
cd server
npm run dev  # 开发环境查看控制台
# 或查看server.log文件
```

#### 前端日志
浏览器开发者工具 → Console / Network

## 性能优化建议

### 后端
1. **缓存机制**：已实现鸡尾酒配方缓存（1小时）
2. **图片CDN**：使用可灵API返回的CDN链接
3. **API限流**：建议在生产环境添加限流中间件

### 前端
1. **图片懒加载**：鸡尾酒图片使用懒加载
2. **代码分割**：Vite自动处理
3. **PWA支持**：可考虑添加PWA功能

## 安全建议

1. **API密钥保护**：不要将密钥提交到版本控制
2. **环境变量分离**：生产环境使用独立的变量
3. **HTTPS强制**：生产环境必须使用HTTPS
4. **输入验证**：后端已对情绪参数进行验证

## 监控与维护

### 健康检查
- 后端健康检查端点：`GET /health`
- 返回服务器状态和版本信息

### 错误监控
建议集成：
- Sentry（错误追踪）
- Loggly（日志聚合）
- New Relic（性能监控）

## 更新与升级

### 更新后端
```bash
cd server
git pull origin main
npm install
pm2 restart mood-bar-api
```

### 更新前端
Vercel等平台支持自动部署，推送代码到main分支即可。

## 联系支持

如有问题，请查看：
1. 项目GitHub Issues
2. API服务商文档：
   - [豆包API文档](https://api.doubao.com/docs)
   - [可灵API文档](https://platform.kling.ai/docs)

---

**最后更新**：2026年4月4日  
**项目状态**：✅ 开发完成，可部署