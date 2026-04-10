# Mood Bar 一键部署指南

## 📋 准备工作
1. **GitHub仓库**: https://github.com/您的用户名/mood-bar
2. **豆包API密钥**: 0f730b02-adba-4054-aedd-4cbd685f95f3
3. **可灵Access Key**: AArEdYPrAb8YThErJCCRfL8N4yKQEgDe
4. **可灵Secret Key**: H9Y8reYrP4HDFTLg9ENtKym3p3nfLNdt

## 🚀 快速部署步骤

### 第1步：后端部署到 Railway
1. 访问 https://railway.app/
2. 点击 **New Project** → **Deploy from GitHub repo**
3. 授权并选择 `mood-bar` 仓库
4. Railway会自动检测并部署Node.js应用
5. 部署完成后，进入 **Settings** → **Environment Variables**
6. 添加以下环境变量：

```env
DOUBAO_API_KEY=0f730b02-adba-4054-aedd-4cbd685f95f3
DOUBAO_API_URL=https://ark.cn-beijing.volces.com/api/v3
DOUBAO_MODEL=doubao-seed-2-0-pro-260215
KLING_ACCESS_KEY=AArEdYPrAb8YThErJCCRfL8N4yKQEgDe
KLING_SECRET_KEY=H9Y8reYrP4HDFTLg9ENtKym3p3nfLNdt
KLING_API_URL=https://api-beijing.klingai.com/v1/images/generations
PORT=3007
NODE_ENV=production
CORS_ORIGIN=*
```

7. 复制Railway提供的URL（如：`https://mood-bar.up.railway.app`）

### 第2步：前端部署到 Vercel
1. 访问 https://vercel.com/
2. 点击 **New Project** → **Import Git Repository**
3. 选择 `mood-bar` 仓库
4. 配置设置：
   - **Framework Preset**: Vite
   - **Root Directory**: `app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 在 **Environment Variables** 中添加：
   ```
   VITE_API_BASE_URL = 您的Railway后端URL
   ```
6. 点击 **Deploy**

### 第3步：更新前端API地址
```bash
# 克隆仓库（如果还没有）
git clone https://github.com/您的用户名/mood-bar.git
cd mood-bar

# 更新API地址
echo "VITE_API_BASE_URL=https://mood-bar.up.railway.app" > app/.env

# 提交更改
git add .
git commit -m "更新API地址为Railway后端"
git push origin master

# Vercel会自动重新部署
```

## 🔧 验证部署
1. **后端健康检查**：访问 `https://your-railway-url.railway.app/health`
2. **前端访问**：访问Vercel提供的URL
3. **功能测试**：选择情绪 → 生成鸡尾酒 → 查看图片

## 💡 常见问题

### Q: API调用失败怎么办？
**检查步骤：**
1. 确认Railway环境变量设置正确
2. 检查豆包API密钥是否有效、有额度
3. 查看Railway日志：Railway Dashboard → 项目 → **Logs**

### Q: 图片不显示怎么办？
**可能原因：**
1. 可灵API密钥未设置或无效
2. 图片生成超时（可灵API有时较慢）
3. 检查后端日志查看具体错误

### Q: 如何查看日志？
- **Railway（后端）**: Dashboard → 项目 → Logs
- **Vercel（前端）**: Dashboard → 项目 → Functions Logs

### Q: 如何更新代码？
```bash
# 本地修改代码后
git add .
git commit -m "更新说明"
git push origin master

# Vercel和Railway都会自动重新部署
```

## 📞 技术支持
如果部署遇到问题：
1. 检查本指南所有步骤
2. 查看平台文档：
   - Railway文档：https://docs.railway.app/
   - Vercel文档：https://vercel.com/docs
3. 豆包API问题：https://console.doubao.com/
4. 可灵API问题：https://platform.kling.ai/

## 🌐 最终效果
- **前端URL**: Vercel提供的地址（如：`https://mood-bar.vercel.app`）
- **后端URL**: Railway提供的地址（如：`https://mood-bar.up.railway.app`）
- **API健康检查**: `https://mood-bar.up.railway.app/health`
- **完整功能**: 与本地测试完全一致

**祝您部署顺利！** 🎉