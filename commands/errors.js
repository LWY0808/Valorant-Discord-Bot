const { getRecentErrors } = require('../utils/errorLogger');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'errors',
    description: '查看错误日志W',

    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ 你没有权限查看错误日志。');
        }

        let page = 1;
        const sendErrorPage = async (pageNum) => {
            const result = getRecentErrors(pageNum);
            const content = result.lines.map((line, i) => `${(result.page - 1) * 10 + i + 1}. ${line}`).join('\n') || '没有错误记录了。';

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('⬅️ 上一页')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(result.page === 1),

                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('➡️ 下一页')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(result.page === result.totalPages)
            );

            return { content: `📋 错误日志 第 ${result.page}/${result.totalPages} 页：\n\`\`\`\n${content}\n\`\`\``, components: [row] };
        };

        const firstPage = await sendErrorPage(page);
        const sentMessage = await message.channel.send(firstPage);

        // 设置交互收集器
        const collector = sentMessage.createMessageComponentCollector({
            time: 60_000, // 60 秒
            filter: i => i.user.id === message.author.id,
        });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'prev') page--;
            if (interaction.customId === 'next') page++;

            const newPage = await sendErrorPage(page);
            await interaction.update(newPage);
        });

        collector.on('end', () => {
            sentMessage.edit({ components: [] });
        });
    }
};