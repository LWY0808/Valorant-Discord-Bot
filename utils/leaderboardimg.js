const puppeteer = require('puppeteer');

function generateLeaderboardHTML(results) {
    return `
    <html>
    <head>
        <meta charset='utf-8'>
        <style>
            body { background: #222; color: #fff; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
            .container { width: 600px; margin: 40px auto; background: #2c2f36; border-radius: 18px; box-shadow: 0 8px 32px #0008; padding: 32px; }
            h1 { text-align: center; color: #ff5555; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px 8px; text-align: left; }
            th { color: #ffb86c; font-size: 1.1em; border-bottom: 2px solid #444; }
            tr { border-bottom: 1px solid #333; }
            tr.top1 { background: #ff555522; }
            tr.top2 { background: #ffd70022; }
            tr.top3 { background: #b8733322; }
            td.rank { font-weight: bold; font-size: 1.2em; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>🤡 菜鸡排行榜</h1>
            <table>
                <tr><th>排名</th><th>玩家</th><th>KD</th></tr>
                ${results.map((p, i) => `
                    <tr class='top${i+1}'>
                        <td class='rank'>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i+1)}</td>
                        <td>${p.username}#${p.tag}</td>
                        <td>${p.avgKD}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    </body>
    </html>
    `;
}

// 生成排行榜图片
async function generateLeaderboardImage(results, filePath) {
    const html = generateLeaderboardHTML(results);
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 700, height: 80 + results.length * 48 });
    await page.screenshot({ path: filePath, fullPage: true });
    await browser.close();
}

module.exports = {
    generateLeaderboardHTML,
    generateLeaderboardImage
};