const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ActivityType, PresenceUpdateStatus, Collection } = require('discord.js');
const { CROWN_CHANNEL_ID } = require('./config.json');
require('dotenv').config();
const axios = require('axios');
axios.defaults.headers.common['Authorization'] = process.env.HENRIK_API_KEY;
const cron = require('node-cron');
const { runCrownTask } = require('./tasks/crownTask.js');
const { setBotClient } = require('./utils/safeApiCall.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 创建一个 commands 容器
client.commands = new Collection();

// 读取 commands 文件夹中的所有 .js 文件
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name && command.execute) {
        client.commands.set(command.name, command);
    } else {
        console.warn(`[WARNING] ${file} 缺少 "name" 或 "execute"`);
    }
}

client.on('ready', () => {
    setBotClient(client);
    client.user.setActivity('!link || !help', { type: ActivityType.Listening });
    client.user.setStatus(PresenceUpdateStatus.Online);
    console.log(`🤖 ${client.user.tag} is ready to roast some Valorant players!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`❌ 执行 ${commandName} 时出错:`, error);
        message.reply('⚠️ 执行指令时出错了！');
    }
});

cron.schedule('0 0 * * *', async () => {
    await runCrownTask(client);
});

// Handle errors
client.on('error', console.error);

// Login
client.login(process.env.DISCORD_TOKEN);

// Export for testing
module.exports = { client };