# Mood Bar 全栈部署到 Vercel + 阿里云域名

## 🎯 最终效果
- **前端**：Vercel 部署，全球 CDN 加速
- **后端 API**：Vercel Serverless Functions，与前端同域名
- **自定义域名**：阿里云购买的域名，国内直接访问
- **自动 HTTPS**：Vercel 免费 SSL 证书

## 🚀 一键部署步骤（10分钟完成）

### 第1步：在 Vercel 导入项目
1. 访问 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择 `guominghui225-sketch/mood-bar` 仓库
4. **框架选择**：Vercel 会自动识别（Vite + Node.js API）
5. 点击 **Deploy**（先不设置环境变量）

### 第2步：设置 Vercel 环境变量（8个）

**进入项目**：Vercel Dashboard → 你的项目 → Settings → Environment Variables

**复制粘贴以下 8 个变量**（一行一个）：

```
DOUBAO_API_KEY=0f730b02-adba-4054-aedd-4cbd685f95f3
KLING_ACCESS_KEY=AArEdYPrAb8YThErJCCRfL8N4yKQEgDe
KLING_SECRET_KEY=H9Y8reYrP4HDFTLg9ENtKym3p3nfLNdt
DOUBAO_API_URL=https://ark.cn-beijing.volces.com/api/v3
KLING_API_URL=https://api-beijing.klingai.com/v1/images/generations
DOUBAO_MODEL=doubao-seed-2-0-pro-260215
PORT=3007
VITE_API_BASE_URL=
```

**⚠️ 注意事项**：
- 每个变量**单独添加**，不要一次性粘贴
- `VITE_API_BASE_URL` 值留空（空字符串）
- 大小写必须完全一致
- 添加后会自动重新部署

### 第3步：验证部署
1. **前端访问**：`https://你的项目名.vercel.app`
2. **API 健康检查**：`https://你的项目名.vercel.app/api/health`
   - 应返回 `{"status":"ok"}`
3. **功能测试**：选择情绪 → 生成鸡尾酒 → 查看图片

### 第4步：阿里云购买域名（可选但推荐）
1. 访问 https://wanwang.aliyun.com/
2. 搜索并购买喜欢的域名（如 `moodbar.cn`, `cocktail.fun` 等）
3. 完成实名认证（国内域名必需）
4. 等待审核通过（通常1-2小时）

### 第5步：配置阿里云 DNS
1. 阿里云控制台 → 域名 → 域名列表
2. 点击你的域名 → **DNS 管理** → **解析设置**
3. 添加两条记录：

| 类型 | 主机记录 | 记录值 | TTL |
|------|----------|--------|-----|
| CNAME | @ | cname.vercel-dns.com | 自动 |
| CNAME | www | cname.vercel-dns.com | 自动 |

### 第6步：Vercel 绑定自定义域名
1. Vercel Dashboard → 你的项目 → Settings → Domains
2. 输入你购买的域名（如 `moodbar.cn`）
3. 点击 **Add**
4. Vercel 会自动验证 DNS 设置（等待几分钟）

### 第7步：等待生效
1. DNS 传播需要 5-30 分钟
2. 访问你的域名测试功能
3. 自动获得 HTTPS 证书（Vercel 提供）

## ✅ 部署完成检查清单

- [ ] Vercel 项目部署成功（`项目名.vercel.app` 可访问）
- [ ] 8 个环境变量全部添加
- [ ] API 健康检查通过（`/api/health` 返回 OK）
- [ ] 前端功能正常（情绪选择 → 鸡尾酒生成 → 图片显示）
- [ ] 阿里云域名购买完成
- [ ] DNS 解析配置正确
- [ ] Vercel 域名绑定成功
- [ ] 自定义域名访问正常（`https://你的域名`）

## 🔧 故障排除

### Q: API 调用失败（404）
**检查**：
1. 访问 `/api/health` 是否正常
2. 查看 Vercel → Functions Logs
3. 确认环境变量 `DOUBAO_API_KEY` 等是否正确

### Q: 图片不显示
**可能原因**：
1. 可灵 API 密钥错误
2. 图片生成超时（可灵 API 有时较慢）
3. 检查 Functions Logs 查看具体错误

### Q: DNS 解析失败
**解决方案**：
1. 等待 30 分钟以上
2. 使用 https://dnschecker.org 检查全球 DNS 传播
3. 确认 CNAME 记录指向 `cname.vercel-dns.com`

### Q: HTTPS 证书问题
**Vercel 自动处理**：
1. 绑定域名后自动申请 SSL 证书
2. 等待几分钟生效
3. 如需强制 HTTPS，在 Vercel → Domains → 开启 **Enforce HTTPS**

## 📈 性能优化建议

### 1. 国内访问加速
- 阿里云域名自动备案（如需）
- 考虑使用 Vercel 中国镜像（如果需要更快的国内访问）

### 2. API 响应优化
- 豆包 API 响应通常在 2-5 秒
- 可灵图片生成可能需要 10-20 秒
- 前端已设置合理超时

### 3. 监控和日志
- **Vercel Logs**：Dashboard → 项目 → Functions Logs
- **错误监控**：可集成 Sentry 等工具
- **访问统计**：Vercel Analytics

## 📞 技术支持

### 如果遇到问题：
1. **查看日志**：Vercel Functions Logs
2. **检查环境变量**：确认 8 个变量全部正确
3. **测试本地**：运行 `start.bat` 确保本地正常
4. **联系支持**：
   - Vercel 文档：https://vercel.com/docs
   - 豆包 API：https://console.doubao.com/
   - 可灵 API：https://platform.kling.ai/

### 紧急恢复：
如果部署失败，可回退到 Railway 方案：
1. 后端部署到 Railway（按 `simple_deploy.md` 步骤）
2. 前端 Vercel 设置 `VITE_API_BASE_URL=你的Railway域名`

## 🌐 最终访问地址
- **默认地址**：`https://你的项目名.vercel.app`
- **自定义域名**：`https://你的阿里云域名`
- **API 端点**：`/api/health`, `/api/cocktail/generate`, `/api/image/generate`
- **功能完整**：与本地测试完全一致

**祝你部署顺利！** 🍸🚀