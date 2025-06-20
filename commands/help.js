const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: '显示所有可用指令及用法说明',

    execute(message) {
        console.log('HELP COMMAND TRIGGERED', args);
        const helpEmbed = new EmbedBuilder()
            .setTitle('🤖 Valorant 嘲讽机器人指令列表')
            .setDescription('根据你最近的比赛数据来进行毒舌评价，让你时刻保持清醒 😈')
            .setColor('#FF4654')
            .addFields(
                {
                    name: '🎯 !agent <用户名#标签>',
                    value: '根据该玩家最近一场比赛的 Agent 和 KDA 给出毒舌评论\n示例：`!agent 笨蛋你进错洞了啦#70808`'
                },
                {
                    name: '📉 !leaderboard',
                    value: '从数据中读取一群玩家，获取他们最近 10 场的平均 KD，生成"菜鸡排行榜"！KDA 越低，排名越高 🤡'
                },
                {
                    name: '🔮 !predict',
                    value: '玄学嘴臭预测，支持自选风格（wizard/caster/nerd/clown），如 `!predict nerd`，也可直接@指定用户。'
                },
                {
                    name: '🔗 !link <用户名#标签>',
                    value: '绑定你的 VALORANT 账号，示例：`!link Faker#KR1`。每个账号只能被一人绑定，每人只能绑定一个账号。'
                },
                {
                    name: '❌ !unlink',
                    value: '解绑你当前绑定的 VALORANT 账号。'
                },
                {
                    name: '🆔 !mybind',
                    value: '查询你当前绑定的 VALORANT 账号。'
                },
                {
                    name: '🔎 !whois @某人',
                    value: '查询指定 Discord 用户绑定的 VALORANT 账号。'
                },
                {
                    name: '📌 注意',
                    value: '所有数据来自 [Henrik Valorant API](https://docs.henrikdev.xyz/)，请确保用户名与标签拼写正确。'
                }
            )
            .setFooter({ text: '由 ❤️ 制作，专治嘴硬选手，比如 JASON SIAK' })
            .setTimestamp();

        message.reply({ embeds: [helpEmbed] });
    }
};