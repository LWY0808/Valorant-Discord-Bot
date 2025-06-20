const fs = require('fs');
const path = require('path');
const playersPath = path.join(__dirname, '../data/players.json');

module.exports = {
    name: 'whois',
    description: '查询指定用户已绑定的VALORANT账号，格式：!whois @某人',
    async execute(message, args) {
        if (!args[0] || !message.mentions.users.size) {
            return message.reply('❌ 格式错误，请 @ 你要查询的用户。例如：!whois @某人');
        }
        const user = message.mentions.users.first();
        let players = [];
        try {
            if (fs.existsSync(playersPath)) {
                players = JSON.parse(fs.readFileSync(playersPath, 'utf-8'));
            }
        } catch (e) {
            return message.reply('❌ 读取玩家数据失败，请联系管理员。');
        }
        const info = players.find(p => p.discordId === user.id);
        if (!info) {
            return message.reply('❌ 该用户还没有绑定 VALORANT 账号。');
        }
        message.reply(`🔎 <@${user.id}> 已绑定的 VALORANT 账号：**${info.username}#${info.tag}**`);
    }
}; 