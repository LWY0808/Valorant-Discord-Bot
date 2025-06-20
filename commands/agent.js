const { EmbedBuilder } = require("discord.js");
const { getPlayerData, generateSarcasticMessage, createAgentEmbed, agentUUID } = require("../utils/agent.js");
const { agentMessages } = require("../messages/agentMessages.js")

module.exports = {
    name: 'agent',
    description: '查询最近一场游戏使用的特工和战绩并进行嘲讽',
    
    async execute(message, args) {
        console.log('AGENT COMMAND TRIGGERED', args);
        if (args.length < 1) {
            message.reply('用法: `!agent <username#tag>` (例子： `!agent 笨蛋你进错洞了啦#70808`)');
            return;
        }

        const [username, tag] = args[0].split('#');
        if (!username || !tag) {
            message.reply('请提供正确的格式: `username#tag`');
            return;
        }

        const loadingMessage = await message.reply('🔍 正在查询你的数据...');

        try {
            const data = await getPlayerData(username, tag);
            if (!data) {
                loadingMessage.edit('❌ 无法找到该玩家的数据或最近游玩记录!');
                return;
            }

            const agent = data.playerData.character;
            const stats = data.playerData.stats;
            const teamResult = data.match.teams[data.playerData.team.toLowerCase()];
            const sarcasticMessage = generateSarcasticMessage(
                agent,
                teamResult.has_won,
                stats.kills,
                stats.deaths,
                stats.assists
            );

            const embed = createAgentEmbed(username, tag, agent, sarcasticMessage, data);
            loadingMessage.edit({ content: '', embeds: [embed] });

        } catch (error) {
            console.error('Error processing agent command:', error);
            loadingMessage.edit('❌ 查询过程中发生错误！');
        }
    }
};