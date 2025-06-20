module.exports = {
    name: 'testcrown',
    async execute(message, args) {
        console.log('TESTCROWN COMMAND TRIGGERED', args);
        const { runCrownTask } = require('../tasks/crownTask.js');
        await runCrownTask(message.client);
        message.reply('crownTask 已手动执行！');
    }
};