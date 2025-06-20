<p align="center">
  <img src="https://i.ibb.co/rG9Y3JMq/1242.jpg" alt="LOGO" width="200"/>
</p>

# 🎮 Valorant Discord Bot

> 基于 Valorant API 的 Discord 机器人，自动生成排行榜、搞笑恶评、账号绑定等多种娱乐功能！

---

## 📋 目录

- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## ✨ 功能特性

- 🔗 **账号绑定**：`!link <用户名#标签>` 绑定你的 Valorant 账号
- ❌ **解绑账号**：`!unlink` 解绑当前账号
- 🆔 **查询绑定**：`!mybind` 查询你当前绑定的账号
- 🔎 **查询他人**：`!whois @某人` 查询指定用户的绑定信息
- 📉 **菜鸡排行榜**：`!leaderboard` 生成最近 10 场比赛的排行榜
- 🤡 **毒舌预测**：`!predict` 玄学嘴臭预测，支持多种风格

---

## 🗂️ 项目结构

```text
valorantBot/
├── bot.js                  # 机器人主入口文件
├── commands/               # 指令处理模块
│   ├── agent.js            # 毒舌评论
│   ├── forcecrown.js       # 强制分配皇冠
│   ├── help.js             # 帮助菜单
│   ├── leaderboard.js      # 排行榜
│   ├── link.js             # 账号绑定
│   ├── mybind.js           # 查询绑定
│   ├── unlink.js           # 解绑
│   └── whois.js            # 查询他人
├── config.json             # 配置文件
├── data/                   # 数据存储
│   ├── players.json        # 玩家绑定信息
│   └── crown.json          # 皇冠分配数据
├── messages/               # 消息模板
├── package.json            # 项目依赖
├── tasks/                  # 定时任务
├── utils/                  # 工具函数
└── README.md               # 项目说明文档
```

---

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/Valorant-Discord-Bot.git
   cd Valorant-Discord-Bot
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   - 复制 `example.env` 为 `.env`，并填写你的 API 密钥等信息。
   ```bash
   cp example.env .env
   ```

4. **启动机器人**
   ```bash
   node bot.js
   ```

---

## ⚙️ 环境变量配置

`.env` 示例（请根据实际情况填写）：

```env
HENRIK_API_KEY=你的HenrikAPI密钥
DISCORD_TOKEN=你的DiscordBotToken
```

---

## ❓ 常见问题

- **Q:** 绑定账号失败怎么办？  
  **A:** 请检查用户名和标签拼写，确保 API Key 正确。

- **Q:** 如何贡献代码？  
  **A:** 欢迎提交 PR 或 issue，详见下方贡献指南。

---

## 🤝 贡献指南

1. Fork 本仓库
2. 新建分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -am 'Add new feature'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 新建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证，详情请参阅 [LICENSE](./LICENSE)。 

## 🙏 致谢

本项目部分数据和功能由 [Henrik Valorant API](https://docs.henrikdev.xyz/) 提供，特此感谢！