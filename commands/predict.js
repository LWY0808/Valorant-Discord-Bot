const { EmbedBuilder } = require('discord.js');
const { personalities, bonusRoasts, fortuneGrades} = require('../messages/predict.js');
const { random } = require("../utils/random.js");
const { getPredict, getFortuneGrade } = require("../utils/predict.js");

module.exports = {
    name: "predict",
    description: "玄学嘴臭预测一下你今天的命运",
    execute(message) {
        const { target, personalityKey, style, roast, grade } = getPredict(message);

        const embed = new EmbedBuilder()
            .setTitle(`🔮 ${target.username} 的玄学预测`)
            .setColor(grade.color)
            .setDescription(`**人格风格**：${personalityKey.toUpperCase()}

                📜 **玄学预测**：
                ${style}

                💬 **嘴臭补充**：
                ${roast}

                📈 **玄学评分**：
                ${grade.label}｜${grade.text}`
            )
            .setFooter({ text: `Powered by 嘴臭玄学引擎` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};