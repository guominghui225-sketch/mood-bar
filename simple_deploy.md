# 最简单的部署方法

## 您的API密钥（记下来）：
```
豆包API: 0f730b02-adba-4054-aedd-4cbd685f95f3
可灵Access Key: AArEdYPrAb8YThErJCCRfL8N4yKQEgDe  
可灵Secret Key: H9Y8reYrP4HDFTLg9ENtKym3p3nfLNdt
```

## 🎯 您只需要做3件事：

### 第1步：创建GitHub仓库
1. 打开 https://github.com/new
2. 仓库名填：`mood-bar`
3. **不勾选**任何选项（不要README、.gitignore、license）
4. 点击创建

### 第2步：上传代码到GitHub
打开终端（CMD或PowerShell），运行：
```bash
cd "E:\claude_workspace\obsidian\carrot\工程预览\mood_bar"

# 添加远程仓库（把 YOUR_USERNAME 换成你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/mood-bar.git

# 推送代码
git push -u origin master
```

### 第3步：在部署平台设置密钥

**A. 后端部署（Railway）**：
1. 访问 https://railway.app/ 注册登录
2. 点击 **New Project** → **Deploy from GitHub repo**
3. 选择你的 `mood-bar` 仓库
4. 等待部署完成（约2分钟）
5. 进入 **Settings** → **Environment Variables**
6. 点击 **Add Variable** 添加以下7个变量：

```
DOUBAO_API_KEY = 0f730b02-adba-4054-aedd-4cbd685f95f3
KLING_ACCESS_KEY = AArEdYPrAb8YThErJCCRfL8N4yKQEgDe
KLING_SECRET_KEY = H9Y8reYrP4HDFTLg9ENtKym3p3nfLNdt
DOUBAO_API_URL = https://ark.cn-beijing.volces.com/api/v3
KLING_API_URL = https://api-beijing.klingai.com/v1/images/generations
DOUBAO_MODEL = doubao-seed-2-0-pro-260215
PORT = 3007
```

**B. 前端部署（Vercel）**：
1. 访问 https://vercel.com/ 注册登录
2. 点击 **New Project** → **Import Git Repository**
3. 选择 `mood-bar` 仓库
4. 配置：
   - **Framework Preset**: Vite
   - **Root Directory**: `app`
5. 在 **Environment Variables** 中添加：
   ```
   VITE_API_BASE_URL = 你的Railway后端URL
   ```
   （Railway URL可以在Railway项目的 **Settings** → **Domains** 找到）

## ✅ 完成！
- 前端：访问Vercel给的网址
- 后端API：`你的Railway网址/health` 可以测试
- 功能：和本地测试完全一样

## 📞 如果卡住：
1. 检查7个环境变量是否全部正确复制
2. Railway日志：项目 → Logs
3. Vercel部署日志：项目 → Deployment → 点击最新部署

## ⚠️ 重要提醒
- 这些密钥只在部署平台填写，**不要**写进代码里
- 如果密钥泄露，可以去豆包/可灵平台重新生成
- Railway有免费额度，完全够用