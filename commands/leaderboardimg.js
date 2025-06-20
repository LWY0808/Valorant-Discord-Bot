const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { getAverageKD } = require('../utils/leaderboard.js');
const { generateLeaderboardImage } = require('../utils/leaderboardimg.js');

const playersPath = path.join(__dirname, '../data/players.json');
const tempDir = path.join(__dirname, '../temp');

module.exports = {
    name: 'leaderboardimg',
    description: '生成最近 10 场比赛的菜鸡排行榜图像版 🖼️',

    async execute(message) {
        const loadingMsg = await message.reply('📸 正在生成排行榜图片，请稍等...');

        let players;
        try {
            players = JSON.parse(fs.readFileSync(playersPath, 'utf-8'));
        } catch (err) {
            return loadingMsg.edit('❌ 无法读取 players.json，请检查文件是否存在且格式正确');
        }

        const results = [];
        for (const player of players) {
            const data = await getAverageKD(player.username, player.tag);
            if (data) results.push({ ...player, avgKD: data.avgKD });
        }

        if (results.length === 0) {
            return loadingMsg.edit('❌ 无法获取任何玩家的数据，请检查 players.json 是否正确');
        }

        results.sort((a, b) => parseFloat(a.avgKD) - parseFloat(b.avgKD));

        const filePath = path.join(tempDir, `leaderboard_${Date.now()}.png`);

        try {
            await generateLeaderboardImage(results, filePath);
            await message.reply({ files: [filePath] });
            loadingMsg.delete();

            // 自动清理图片
            setTimeout(() => {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error(`清理排行榜图片失败: ${err.message}`);
                }
            }, 10000);
        } catch (e) {
            console.error('图片生成失败:', e);
            loadingMsg.edit('❌ 图片生成失败，请确认 puppeteer 已安装且可用。');
        }
    }
};