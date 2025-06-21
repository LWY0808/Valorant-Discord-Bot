module.exports = {
    name: 'testcrown',
    async execute(message) {
        console.log('TESTCROWN COMMAND TRIGGERED');
        const { runCrownTask } = require('../tasks/crownTask.js');
        await runCrownTask(message.client);
        message.reply('crownTask 已手动执行！');
    }
};