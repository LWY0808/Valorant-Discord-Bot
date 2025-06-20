const fs = require('fs');
const path = require('path');
const axios = require('axios');
const playersPath = path.join(__dirname, '../data/players.json');
const API_KEY = process.env.HENRIK_API_KEY

module.exports = {
    name: 'link',
    description: '绑定你的VALORANT账号，格式：!link NAME#TAG',
    async execute(message, args) {
        console.log('LINK COMMAND TRIGGERED', args);
        if (!args[0] || !args[0].includes('#')) {
            return message.reply('❌ 格式错误，请使用：!link NAME#TAG');
        }
        const [username, tag] = args[0].split('#');
        if (!username || !tag) {
            return message.reply('❌ 格式错误，请使用：!link NAME#TAG');
        }
        // 读取 players.json
        let players = [];
        try {
            if (fs.existsSync(playersPath)) {
                players = JSON.parse(fs.readFileSync(playersPath, 'utf-8'));
            }
        } catch (e) {
            return message.reply('❌ 读取玩家数据失败，请联系管理员。');
        }
        // 检查该 Discord 用户是否已绑定
        if (players.find(p => p.discordId === message.author.id)) {
            const old = players.find(p => p.discordId === message.author.id);
            return message.reply(`❌ 你已绑定 VALORANT 账号：${old.username}#${old.tag}，如需更换请先解绑。`);
        }
        // 检查该 VALO 账号是否已被其他用户绑定
        if (players.find(p => p.username.toLowerCase() === username.toLowerCase() && p.tag.toLowerCase() === tag.toLowerCase())) {
            return message.reply('❌ 该 VALORANT 账号已被其他用户绑定，无法重复绑定。');
        }
        // 验证账号是否存在
        try {
            const res = await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${username}/${tag}`,
                {
                    headers: {
                        Authorization: API_KEY
                    }
                }
            );
            if (res.data.status !== 200) {
                return message.reply('❌ 未找到该VALORANT账号，请检查拼写。');
            }
        } catch (err) {
            return message.reply('❌ 验证账号时出错，请稍后再试。');
        }
        // 写入 players.json
        players.push({ discordId: message.author.id, username, tag });
        try {
            fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), 'utf-8');
        } catch (e) {
            return message.reply('❌ 写入玩家数据失败，请联系管理员。');
        }
        message.reply(`✅ 账号绑定成功！你的VALORANT账号：**${username}#${tag}**`);
    }
}; 