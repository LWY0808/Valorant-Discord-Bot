const fs = require('fs');
const path = require('path');
const { getAverageKD } = require('../utils/leaderboard.js');

const playersPath = path.join(__dirname, '../data/players.json');
const crownPath = path.join(__dirname, '../data/crown.json');

module.exports = {
    name: 'forcecrown',
    description: '强制执行菜鸡勋章系统，评选出当天最菜的玩家 👑',

    async execute(message) {
        console.log('FORCECROWN COMMAND TRIGGERED');
        const loadingMsg = await message.reply('🚨 正在强制执行菜鸡勋章系统，请稍等...');

        let players;
        try {
            players = JSON.parse(fs.readFileSync(playersPath, 'utf-8'));
        } catch (err) {
            return loadingMsg.edit('❌ 无法读取 players.json，请检查文件是否存在且格式正确');
        }

        const results = [];
        for (const player of players) {
            const data = await getAverageKD(player.username, player.tag);
            if (data) results.push({ ...data, discordId: player.discordId });
        }

        if (results.length === 0) {
            return loadingMsg.edit('❌ 无法获取任何玩家的数据，请检查 players.json 是否正确');
        }

        results.sort((a, b) => parseFloat(a.avgKD) - parseFloat(b.avgKD));
        const loser = results[0];

        // 加载 crown.json
        let crown;
        try {
            crown = JSON.parse(fs.readFileSync(crownPath, 'utf-8'));
        } catch (err) {
            crown = { current: {}, history: [] };
        }

        let streak = 1;
        if (
            crown.current.username === loser.username &&
            crown.current.tag === loser.tag
        ) {
            streak = crown.current.streak + 1;
        }

        crown.current = {
            username: loser.username,
            tag: loser.tag,
            discordId: loser.discordId,
            avgKD: loser.avgKD,
            streak: streak
        };

        crown.history.push({
            date: new Date().toISOString().slice(0, 10),
            username: loser.username,
            tag: loser.tag,
            discordId: loser.discordId,
            avgKD: loser.avgKD
        });

        fs.writeFileSync(crownPath, JSON.stringify(crown, null, 2), 'utf-8');

        let msg = `👑 今日菜鸡王依旧是 <@${loser.discordId}>（${loser.username}#${loser.tag}）！\nKDA ${loser.avgKD}，连续 ${streak} 天守擂成功！\n`;
        if (streak >= 3) msg += `你已经连续 ${streak} 天蝉联菜鸡王，建议考虑换游戏了 🤡\n`;
        if (parseFloat(loser.avgKD) < 0.8) msg += `KDA 低到令人发指，队友看了想报警！\n`;

        msg += `\n📉 历史最菜榜：\n`;

        const streakMap = {};
        for (const h of crown.history) {
            const key = `${h.username}#${h.tag}`;
            streakMap[key] = (streakMap[key] || 0) + 1;
        }

        const topLosers = Object.entries(streakMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        topLosers.forEach(([key, days], idx) => {
            msg += `#${idx + 1} ${key}：${days} 天\n`;
        });

        loadingMsg.edit(msg);
    }
};