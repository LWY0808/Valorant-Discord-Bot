# Valorant Discord Bot

## 项目简介
这是一个用于 Valorant 游戏的 Discord 机器人，能够根据玩家的比赛数据提供毒舌评论、生成排行榜、绑定玩家账号等功能。

## 功能特性
- **绑定账号**：使用 `!link <用户名#标签>` 绑定你的 Valorant 账号。
- **解绑账号**：使用 `!unlink` 解绑当前绑定的 Valorant 账号。
- **查询绑定**：使用 `!mybind` 查询你当前绑定的 Valorant 账号。
- **查询他人绑定**：使用 `!whois @某人` 查询指定用户的绑定信息。
- **生成排行榜**：使用 `!leaderboard` 生成最近 10 场比赛的菜鸡排行榜。
- **毒舌预测**：使用 `!predict` 进行嘴臭预测，支持自选风格。

## 项目结构
```
valorantBot/
  ├── bot.js                  # 机器人主入口文件
  ├── commands/               # 指令处理模块
  │   ├── agent.js            # 根据玩家数据生成毒舌评论
  │   ├── forcecrown.js       # 强制分配皇冠指令
  │   ├── help.js             # 帮助指令，展示所有可用指令
  │   ├── leaderboard.js      # 排行榜指令
  │   ├── link.js             # 绑定指令
  │   ├── mybind.js           # 查询绑定指令
  │   ├── unlink.js           # 解绑指令
  │   └── whois.js            # 查询他人绑定指令
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

## 安装与使用
1. 克隆项目：
   ```bash
   git clone https://github.com/你的用户名/Valorant-Discord-Bot.git
   cd Valorant-Discord-Bot
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   - 复制 `example.env` 为 `.env` 文件，并根据实际情况填写你的 API 密钥等敏感信息。
   ```bash
   cp example.env .env
   ```

4. 启动机器人：
   ```bash
   node bot.js
   ```

## 贡献
欢迎任何形式的贡献！请提交 issue 或 pull request。

## 许可证
本项目采用 MIT 许可证，详情请参阅 LICENSE 文件。 