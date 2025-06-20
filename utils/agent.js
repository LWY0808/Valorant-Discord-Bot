const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { HENRIK_API_KEY } = process.env.HENRIK_API_KEY;
axios.defaults.headers.common['Authorization'] = HENRIK_API_KEY;
const { random } = require('../utils/random.js');

// 获取玩家数据
async function getPlayerData(username, tag) {
    try {
        const accountResponse = await axios.get(
            `https://api.henrikdev.xyz/valorant/v1/account/${username}/${tag}`
        );
        if (accountResponse.data.status !== 200) return null;

        const account = accountResponse.data.data;

        const matchResponse = await axios.get(
            `https://api.henrikdev.xyz/valorant/v3/matches/${account.region}/${username}/${tag}?size=1`
        );
        if (matchResponse.data.status !== 200 || !matchResponse.data.data || matchResponse.data.data.length === 0)
            return null;

        const match = matchResponse.data.data[0];
        const playerData = match.players.all_players.find(
            (p) =>
                p.name.toLowerCase() === username.toLowerCase() &&
                p.tag.toLowerCase() === tag.toLowerCase()
        );

        return {
            account,
            playerData,
            match
        };
    } catch (error) {
        console.error('Error fetching player data:', error.response?.data || error.message);
        return null;
    }
}
 
// 生成讽刺性消息
function generateSarcasticMessage(agent, hasWon, kills, deaths, assists) {
    const kdaRatio = deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);

    if (hasWon) {
        if (kills >= 20) {
            return random([
                `用 ${agent} 完全统治战场，队友都在看你表演！别太飘了😎`,
                `带着 ${agent} 一路杀疯了，建议敌人早点投降 😂`,
                `打出超神操作的 ${agent}，让人怀疑你是不是挂哥🤖`,
                `全场 MVP 非你莫属，${agent} 在你手上像开挂一样🔥`
            ]);
        } else if (kills < 5) {
            return random([
                `用 ${agent} 拿了个隐藏人头数冠军，差点以为你掉线了 🫣`,
                `全程划水的 ${agent}，运气好碰上了能赢的队友 🤡`,
                `完全没存在感的 ${agent}，赢了纯靠队友给力 💀`,
                `用 ${agent} 打出了职业观众级别的表现 🪑`
            ]);
        } else {
            return random([
                `中规中矩地用 ${agent} 胜利了，但你确定你参与过比赛吗？😅`,
                `${agent} 表现平平，不过好歹站在胜者组 👏`,
                `虽然赢了，但 ${agent} 好像就是个路人角色 😂`,
                `低调地混了一局，用 ${agent} 偷偷摸摸苟到了胜利 🐭`
            ]);
        }
    } else {
        if (kills > deaths && kdaRatio >= 1.2) {
            return random([
                `虽然输了，但 ${agent} 你已经尽力了，全队最亮的崽 💡`,
                `用 ${agent} 独自苦撑全场，队友全体梦游 💤`,
                `输了不怪你，${agent} 都快变成守护神了 🧎‍♂️`,
                `你用 ${agent} 已经救不动这个团队了 🚑`
            ]);
        } else if (kills <= 5) {
            return random([
                `用 ${agent} 打出了屠夫都看不下去的数据 ${kills}/${deaths}/${assists} 🤯`,
                `你确定不是敌方的卧底？${agent} 简直灾难现场 💣`,
                `全场最可疑的 ${agent}，KDA 让人想报警 📞110`,
                `这不是比赛，这是献祭仪式，用 ${agent} 当场祭天 🔥`
            ]);
        } else {
            return random([
                `${agent} 打得稀碎，输了别怪队友，你也有锅 🍳`,
                `虽然表现一般，但用 ${agent} 还是输得理直气壮 🤷‍♂️`,
                `整场下来感觉 ${agent} 就是来凑人数的 📦`,
                `输了也不奇怪，用 ${agent} 这样打，队友心态都崩了 😮‍💨`
            ]);
        }
    }
}

const agentUUID = {
    "Brimstone": "9f0d8ba9-4140-b941-57d3-a7ad57c6b417",
    "Viper": "707eab51-4836-f488-046a-cda6bf494859",
    "Omen": "8e253930-4c05-31dd-1b6c-968525494517",
    "Killjoy": "1db7f7c0-46df-4fe2-b8f0-7e3d9e3d9e3d",
    "Cypher": "afa8e2ff-9c9d-8f20-9b82-a1e3e5ef9b3a",
    "Sova": "ded3520f-4264-bfed-162d-b080e2abccf9",
    "Sage": "569fdd95-4d10-43ab-ca70-79becc718b46",
    "Phoenix": "eb93336a-449b-9c1b-0a54-a891f7921d69",
    "Jett": "f94c3b30-42be-e959-889c-5aa313dba261",
    "Reyna": "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc",
    "Raze": "f4a5fcb2-3d5d-3d9b-3bc0-0200d7fc7df0",
    "Breach": "5f8d3a7f-467b-97f3-062c-13acf203c006",
    "Skye": "6f2a04ca-43e0-be17-7f36-b3908627744d",
    "Yoru": "7f2007cd-4f2e-8aa8-a4ed-25a69545e5b3",
    "Astra": "41fb69c1-4189-7b37-f117-bcaf1e96f1bf",
    "KAY/O": "601dbbe7-43ce-be57-2a40-4abd24953621",
    "Chamber": "22697a3d-45bf-8dd7-4fec-84a9e813c94a",
    "Neon": "bb2a4828-46eb-8cd1-e765-15848195d751",
    "Fade": "dade69b4-4f5a-8528-247b-219e5a1facd6",
    "Harbor": "95b78ed7-4637-86d9-7e41-71ba8c293152",
    "Gekko": "e370fa57-4757-3604-3648-499e1f642d3f",
    "Deadlock": "cc7ebd11-478c-5504-8240-1cbd7cbeae0c",
    "Iso": "d2a9e7c0-433f-912c-8eee-ae49459de9a7",
    "Clove": "fd267378-4d1d-4d64-91bc-60639396191d",
    "Tejo": "b444168c-4e35-8076-db47-ef9bf368f384",
    "Vyse": "efba5359-4016-a1e5-7626-b1ae76895940",
    "Waylay": "df1cb487-4902-002e-5c17-d28e83e78588"
};
  
  // 创建 Embed 信息
function createAgentEmbed(username, tag, agent, message, matchData) {
    const stats = matchData.playerData.stats;
    const playerTeam = matchData.playerData.team.toLowerCase();
    const teamResult = matchData.match.teams[playerTeam];
  
    const embed = new EmbedBuilder()
        .setTitle('🎮 Valorant Match Roast!')
        .setDescription(`**${username}#${tag}** ${message}`)
        .setColor('#FF4654')
        .addFields(
            { name: '🎯 Agent', value: agent, inline: true },
            { name: '👤 Player', value: `${username}#${tag}`, inline: true },
            { name: '🗺️ Last Map', value: matchData.match.metadata.map, inline: true },
            { name: '📈 KDA', value: `${stats.kills}/${stats.deaths}/${stats.assists}`, inline: true }
        )
        .setThumbnail(`https://media.valorant-api.com/agents/${agentUUID[agent]}/displayicon.png`)
        .setFooter({ text: 'Roasted by your friendly Valorant bot 🔥' })
        .setTimestamp();
  
    if (teamResult) {
        embed.addFields({
            name: '📊 Last Match',
            value: `${teamResult.has_won ? '🏆 Victory' : '💀 Defeat'} (${teamResult.rounds_won}-${teamResult.rounds_lost})`,
            inline: true
        });
    }
  
    return embed;
}

module.exports = {
    getPlayerData,
    createAgentEmbed,
    generateSarcasticMessage,
    agentUUID
}