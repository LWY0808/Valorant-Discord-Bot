const fs = require('fs');
const path = require('path');
const playersPath = path.join(__dirname, '../data/players.json');

module.exports = {
    name: 'mybind',
    description: '查询你已绑定的VALORANT账号',
    async execute(message) {
        let players = [];
        try {
            if (fs.existsSync(playersPath)) {
                players = JSON.parse(fs.readFileSync(playersPath, 'utf-8'));
            }
        } catch (e) {
            return message.reply('❌ 读取玩家数据失败，请联系管理员。');
        }
        const info = players.find(p => p.discordId === message.author.id);
        if (!info) {
            return message.reply('❌ 你还没有绑定 VALORANT 账号。');
        }
        message.reply(`🔗 你已绑定的 VALORANT 账号：**${info.username}#${info.tag}**`);
    }
}; 