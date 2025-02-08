# 🚀 微信关键词监控机器人

## 📖 项目介绍
本项目是一个基于 **Wechaty** 和 **Express** 的微信关键词监控机器人，可以自动监控微信群聊中的关键词并触发通知。项目采用前后端分离架构，前端使用 Vite + Vue.js，后端使用 Express + WebSocket。

### 主要功能
- **关键词监控**: 自动监控微信群聊消息中的关键词(参考 bot.js 中的 KEYWORDS 配置)
- **消息转发**: 将匹配到的消息转发给指定联系人(参考 bot.js 中的 TARGET_NAME 配置)
- **实时日志**: 通过 WebSocket 实时显示监控和系统日志
- **二维码登录**: 自动生成并显示微信登录二维码
- **桌面通知**: 检测到关键词时发送系统通知

## 🛠️ 项目结构
```
WeChat-Keyword-Monitoring/
├── backend/                    # 后端代码
│   ├── src/
│   │   ├── bot.js             # 微信机器人核心逻辑
│   │   └── server.js          # Express 服务器
│   └── package.json           # 后端依赖配置
├── frontend/                   # 前端代码
│   ├── src/
│   │   └── main.js            # 前端主逻辑
│   ├── index.html             # 前端入口页面
│   └── package.json           # 前端依赖配置
```

## 🚀 启动项目

### 1. 启动后端
```bash
cd backend
npm install
npm start
```
后端服务将在 http://localhost:3000 启动

### 2. 启动前端
```bash
cd frontend
npm install
npm run dev
```
前端页面将在 http://localhost:5173 启动

### 3. 使用说明
1. 打开浏览器访问 http://localhost:5173
2. 等待页面显示微信登录二维码
3. 使用微信扫描二维码登录
4. 登录成功后，机器人将自动开始监控消息

## ⚙️ 配置说明
在 `backend/src/bot.js` 中可以配置以下参数：
```javascript
const KEYWORDS = ['出']; // 设置需要监控的关键词
const TARGET_NAME = 'BytePixel'; // 设置接收消息的目标联系人

## 📌 注意事项
1. **消息过滤**:
   - 消息长度小于20字符的会被过滤（可以自行修改）
   - 引用消息会被自动过滤
   - 图片、视频等媒体消息不会被处理

2. **封号风险**:
   - 避免频繁的消息发送
   - 建议使用小号进行测试
   - 遵守微信使用规范，避免违规操作

3. **运行环境**:
   - Node.js 版本需 >= 12.0.0
   - 确保系统支持桌面通知功能
   - 确保网络能够正常访问微信服务器

4. **错误处理**:
   - 前端会实时显示各类错误信息
   - 可以通过终端日志查看详细错误信息
   - WebSocket 断开时会自动尝试重连

---
## 🤝 开发建议
1. 开发时建议使用 `npm run dev` 启动后端，支持热重载
2. 可以通过前端页面的终端日志实时查看运行状态
3. 建议在本地开发环境充分测试后再部署到生产环境



如有问题或建议，欢迎提交 Issue 或 Pull Request！

