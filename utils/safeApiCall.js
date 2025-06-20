const axios = require('axios');
const { HENRIK_API_KEY } = process.env.HENRIK_API_KEY;
axios.defaults.headers.common['Authorization'] = HENRIK_API_KEY;

let botClient = null;
const adminId = '889445083638796309';

function setBotClient(client) {
    botClient = client;
}

async function notifyAdmin(msg) {
    if (botClient) {
        try {
            const user = await botClient.users.fetch(adminId);
            if (user) await user.send(msg);
        } catch (e) {
            console.log('[管理员通知失败]', e.message);
        }
    } else {
        console.log('[管理员通知]', msg);
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeApiCall(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await axios.get(url, options);
            return res;
        } catch (err) {
            if (err.response && err.response.status === 429) {
                // 速率限制报警
                notifyAdmin('API调用过于频繁，已被限流！');
                await sleep(1000 * (i + 1)); // 退避
            } else if (i === retries - 1) {
                notifyAdmin(`API调用失败：${err.message}`);
            }
        }
    }
    return null;
}

module.exports = {
    safeApiCall,
    setBotClient
}