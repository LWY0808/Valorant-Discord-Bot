const fs = require('fs');
const path = require('path');
const playersPath = path.join(__dirname, '../data/players.json');

module.exports = {
    name: 'unlink',
    description: '解绑你的VALORANT账号',
    async execute(message) {
        console.log('UNLINK COMMAND TRIGGERED', args);
        let players = [];
        try {
            if (fs.existsSync(playersPath)) {
                players = JSON.parse(fs.readFileSync(playersPath, 'utf-8'));
            }
        } catch (e) {
            return message.reply('❌ 读取玩家数据失败，请联系管理员。');
        }
        const idx = players.findIndex(p => p.discordId === message.author.id);
        if (idx === -1) {
            return message.reply('❌ 你还没有绑定 VALORANT 账号，无需解绑。');
        }
        const old = players[idx];
        players.splice(idx, 1);
        try {
            fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), 'utf-8');
        } catch (e) {
            return message.reply('❌ 写入玩家数据失败，请联系管理员。');
        }
        message.reply(`✅ 已解绑你的 VALORANT 账号：**${old.username}#${old.tag}**`);
    }
}; 