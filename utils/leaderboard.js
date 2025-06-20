const axios = require('axios');
const API_KEY = process.env.HENRIK_API_KEY

const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 秒

async function getAverageKD(username, tag) {
    const cacheKey = `${username.toLowerCase()}#${tag.toLowerCase()}`;
    const now = Date.now();
    if (cache.has(cacheKey)) {
        const { data, timestamp } = cache.get(cacheKey);
        if (now - timestamp < CACHE_TTL) {
            return data;
        } else {
            cache.delete(cacheKey);
        }
    }
    try {
        const accountRes = await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${username}/${tag}`,
            {
                headers: {
                    Authorization: API_KEY
                }
            }
        );
        if (accountRes.data.status !== 200) return null;
        const region = accountRes.data.data.region;

        const matchRes = await axios.get(
            `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${username}/${tag}?size=10`,
            {
                headers: {
                    Authorization: API_KEY
                }
            }
        );
        if (matchRes.data.status !== 200 || !matchRes.data.data) return null;

        const matches = matchRes.data.data;
        let totalKills = 0, totalDeaths = 0, games = 0;

        for (const match of matches) {
            const player = match.players.all_players.find(p =>
                p.name.toLowerCase() === username.toLowerCase() &&
                p.tag.toLowerCase() === tag.toLowerCase()
            );
            if (!player) continue;

            totalKills += player.stats.kills;
            totalDeaths += player.stats.deaths;
            games += 1;
        }

        if (games === 0) return null;
        const kd = totalDeaths === 0 ? totalKills : totalKills / totalDeaths;
        const result = {
            username,
            tag,
            avgKD: kd.toFixed(2),
            kills: totalKills,
            deaths: totalDeaths,
        };
        cache.set(cacheKey, { data: result, timestamp: now });
        return result;
    } catch (err) {
        console.error(`获取 ${username}#${tag} 的数据失败：`, err.message);
        return null;
    }
}

module.exports = {
    getAverageKD
}