const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '../data/error.log');

function logError(error, context = 'Unknown') {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] [${context}] ${error.stack || error}\n`;
    fs.appendFile(LOG_PATH, message, err => {
        if (err) console.error('❌ 写入错误日志失败:', err);
    });
}

function getRecentErrors(page = 1, perPage = 10) {
    if (!fs.existsSync(LOG_PATH)) return [];

    const lines = fs.readFileSync(LOG_PATH, 'utf-8')
        .trim()
        .split('\n');

    const total = lines.length;
    const maxPage = Math.ceil(total / perPage);
    const safePage = Math.min(Math.max(page, 1), maxPage);
    const start = (safePage - 1) * perPage;

    return {
        lines: lines.slice(start, start + perPage),
        page: safePage,
        totalPages: maxPage,
        totalLines: total
    };
}

module.exports = {
    logError,
    getRecentErrors
};
