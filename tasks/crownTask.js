const fs = require('fs');
const path = require('path');
const { getAverageKD } = require('../utils/leaderboard.js');
const { CROWN_CHANNEL_ID } = require('../config.json');

// 路径集中定义，更安全
const playersPath = path.join(__dirname, '../data/players.json');
const crownPath = path.join(__dirname, '../data/crown.json');

// players.json 内存缓存，启动时加载
let playersCache = null;
function loadPlayers() {
    if (!playersCache) {
        playersCache = JSON.parse(fs.readFileSync(playersPath, 'utf-8'));
    }
    return playersCache;
}

// crown.json 内存缓存+批量写入
let crownCache = null;
let crownDirty = false;
function loadCrown() {
    if (!crownCache) {
        crownCache = JSON.parse(fs.readFileSync(crownPath, 'utf-8'));
    }
    return crownCache;
}
function saveCrown() {
    if (crownDirty && crownCache) {
        fs.writeFileSync(crownPath, JSON.stringify(crownCache, null, 2), 'utf-8');
        crownDirty = false;
    }
}
// 定时批量落盘
setInterval(saveCrown, 5000);
// 进程退出前强制落盘
process.on('exit', saveCrown);
process.on('SIGINT', () => { saveCrown(); process.exit(); });

async function runCrownTask(client) {
    const players = loadPlayers();
    let results = [];

    for (const player of players) {
        const data = await getAverageKD(player.username, player.tag);
        if (data) results.push({ ...data, discordId: player.discordId });
    }

    if (results.length === 0) return;

    results.sort((a, b) => parseFloat(a.avgKD) - parseFloat(b.avgKD));
    const loser = results[0];

    let crown = loadCrown();
    let streak = 1;
    if (crown.current.username === loser.username && crown.current.tag === loser.tag) {
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
    crownDirty = true;

    let msg = `👑 今日菜鸡王依旧是 <@${loser.discordId}>（${loser.username}#${loser.tag}）！\nKDA ${loser.avgKD}，连续${streak}天守擂成功！\n`;
    if (streak >= 3) msg += `你已经连续${streak}天蝉联菜鸡王，建议考虑换游戏了 🥇\n`;
    if (parseFloat(loser.avgKD) < 0.8) msg += `KDA 低到令人发指，队友看了想报警！\n`;

    msg += `\n历史最菜榜：\n`;
    const streakMap = {};
    for (const h of crown.history) {
        const key = h.username + '#' + h.tag;
        streakMap[key] = (streakMap[key] || 0) + 1;
    }
    const topLosers = Object.entries(streakMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
    topLosers.forEach(([key, days], idx) => {
        msg += `#${idx + 1} ${key}：${days} 天\n`;
    });

    const channelId = CROWN_CHANNEL_ID || '1123302322706059405';
    const channel = client.channels.cache.get(channelId);
    if (channel) channel.send(msg);
}

module.exports = { runCrownTask };