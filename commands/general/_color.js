const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, db) {
    if (!isNaN(args[1]) && !isNaN(args[2]) && !isNaN(args[3])) { //9437439
        db.get("users").find(user => user.id == msg.author.id).update("color", n => {return combineRGB(args[1], args[2], args[3])}).write();

        var user = db.get("users").find(user => user.id == msg.author.id).value();

        var totalXP = user.xp;
        for (var j = 0; j < user.level - 1; j++) {
            totalXP += (user.level * config.xpCoefficient);
        }
        config.rankProgression.forEach(rank => {
            if (user.level >= rank.startLevel)
                user.rank = rank.levelName;
        });
        msg.reply("Ok, here is your new tag!");
        sendCheckCard(msg, user, totalXP);
    } else {
        msg.reply("Oops, you may have used that wrong, proper usage is: ``" + config.prefix + "color [red] [green] [blue]``");
    }
}

var sendCheckCard = (msg, userStats, totalXP) => {
    msg.channel.send({
        embed: {
            color: userStats.color,
            title: "\"" + userStats.quote + "\"",
            author: {
                name: msg.author.username
            },
            thumbnail: {
                url: msg.author.avatarURL
            },
            fields: [
                {
                    name: "Level",
                    value: userStats.level
                },
                {
                    name: "XP",
                    value: userStats.xp + "/" + (userStats.level * config.xpCoefficient) + "\nTotal: " + totalXP + "XP"
                },
                {
                    name: "Rank(s)",
                    value: userStats.rank + "\n" + userStats.rankSP
                }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.tag
            }
        }
    });
}

var combineRGB = (r, g, b) => {
    //Function from https://github.com/leovoel/embed-visualizer
    return (r << 16) | (g << 8) | b;
}

exports.info = {
    name: 'color',
    usage: 'color [red] [green] [blue]',
    description: 'Sets your color',
    category: "stats"
};