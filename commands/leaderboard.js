const { EmbedBuilder } = require('discord.js');
const { getAverageKD } = require('../utils/leaderboard.js');
const players = require('../data/players.json');

module.exports = {
    name: 'leaderboard',
    description: '生成最近10场比赛的菜鸡排行榜（KDA 越低排名越高）',

    async execute(message) {
        console.log('LEADERBOARD COMMAND TRIGGERED', args);
        const loadingMsg = await message.reply('📊 正在拉取所有选手的最近 10 场比赛数据，请稍等...');

        const results = [];

        for (const player of players) {
            const data = await getAverageKD(player.username, player.tag);
            if (data) results.push(data);
        }

        if (results.length === 0) {
            loadingMsg.edit('❌ 无法获取任何玩家的数据，请检查 players.json 是否正确');
            return;
        }

        // 按 avgKDA 升序排列（越低越菜）
        results.sort((a, b) => parseFloat(a.avgKD) - parseFloat(b.avgKD));

        // 构造排行榜文本
        const rankList = results.map((p, index) => {
            let medal = '';
            if (index === 0) medal = '🥇';
            else if (index === 1) medal = '🥈';
            else if (index === 2) medal = '🥉';
            else medal = `#${index + 1}`;

            const roast = parseFloat(p.avgKD) < 1.0
                ? '（菜到逆天 🌚）'
                : parseFloat(p.avgKD) < 1.2
                ? '（你练枪吗 💩）'
                : parseFloat(p.avgKD) < 1.5
                ? '（勉强像人 🤖）'
                : '（这货装菜的吧 🤔）';

            return `${medal} **${p.username}#${p.tag}** → 平均KD: **${p.avgKD}** ${roast}`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🤡 菜鸡排行榜 - 最近10场')
            .setDescription(rankList)
            .setColor('#ff5555')
            .setFooter({ text: 'KD 越低排名越高！你今天 菜了吗？' })
            .setTimestamp();

        loadingMsg.edit({ content: '', embeds: [embed] });
    }
};