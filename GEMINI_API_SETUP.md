# Google Gemini API 申请指南

## 🚀 快速申请（2分钟）

### 步骤1：访问 Google AI Studio
打开浏览器访问：
```
https://aistudio.google.com/app/apikey
```

### 步骤2：登录 Google 账号
- 使用你的 Gmail 邮箱登录
- 如果没有账号，先注册一个

### 步骤3：创建 API Key
1. 点击 **"Create API Key"** 按钮
2. 选择 **"Create API key in new project"**（推荐）
3. 复制生成的 API Key（格式：`AIzaSy...`）

### 步骤4：保存 API Key
将 Key 保存到安全的地方，格式如下：
```
AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 💻 接入项目

### 1. 设置环境变量
创建 `.env` 文件：
```bash
cd "/Users/hb/Downloads/starlight-engine-ecosystem-matrix (3)"
echo "VITE_GEMINI_API_KEY=你的APIKey" > .env
```

### 2. 修改代码配置
编辑 `services/geminiService.ts`：
```typescript
// 第5行，替换为：
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '你的APIKey';
```

### 3. 重启开发服务器
```bash
npm run dev
```

---

## 📊 API 免费额度

| 模型 | 免费额度 | 超出费用 |
|-----|---------|---------|
| Gemini 2.5 Flash | 1,500 请求/天 | $0.15/百万 tokens |
| Gemini 2.5 Pro | 50 请求/天 | $1.25/百万 tokens |
| Gemini 2.5 Flash Image | 1,500 请求/天 | $0.15/百万 tokens |
| Gemini 2.5 Flash TTS | 1,500 请求/天 | $0.15/百万 tokens |

---

## ✅ 验证是否成功

申请完成后，在浏览器控制台测试：
```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=你的APIKey', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Hello' }] }]
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

如果返回结果而不是错误，说明 API Key 有效！

---

## 🆘 常见问题

### Q: 提示 "API key not valid"
**解决**: 
1. 检查 Key 是否复制完整（不要有多余空格）
2. 确认已启用 Gemini API：https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

### Q: 提示 "Quota exceeded"
**解决**: 免费额度用完，等待次日重置或升级到付费计划

### Q: 中国大陆访问问题
**解决**: 需要科学上网才能访问 Google AI Studio

---

## 🎯 申请完成后告诉我

把 API Key 发给我（前10位即可，如 `AIzaSyAbCd...`），我帮你：
1. 配置到项目中
2. 测试 AI 生成功能
3. 确保所有模块正常工作
