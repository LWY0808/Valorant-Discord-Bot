const { fortuneGrades, personalities, bonusRoasts } = require('../messages/predict.js');
const { random } = require('../utils/random.js');

function getFortuneGrade() {
    const roll = Math.random();
    if (roll < 0.02) return fortuneGrades[4];
    if (roll < 0.15) return fortuneGrades[0];
    if (roll < 0.4) return fortuneGrades[1];
    if (roll < 0.7) return fortuneGrades[2];
    return fortuneGrades[3];
}
function getPredict(message) {
    const args = message.content.split(' ');
    const target = message.mentions.users.first() || message.author;
    const personalityKey = args[1] && personalities[args[1]] ? args[1] : random(Object.keys(personalities));

    const style = random(personalities[personalityKey]);
    const roast = random(bonusRoasts);
    const grade = getFortuneGrade();

    return {
        target,
        personalityKey,
        style,
        roast,
        grade
    }
}

module.exports = {
    getPredict,
    getFortuneGrade
}