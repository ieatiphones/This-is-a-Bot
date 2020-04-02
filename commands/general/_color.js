const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat) {
    if (!isNaN(args[1]) && !isNaN(args[2]) && !isNaN(args[3])) { //9437439
        stat.updateOne({ id: msg.author.id }, {
            $set: {
                color: combineRGB(args[1], args[2], args[3])
            }
        });
        stat.findOne({ id: msg.author.id }, (err, res) => {
            if (err) msg.reply("Error retrieving data from MongoDB.");
            if (res) {
                var totalXP = res.xp;
                for (var j = 0; j < res.level - 1; j++) {
                    totalXP += (res.level * config.xpCoefficient);
                }
                sendCheckCard(msg, res, totalXP);
            } else {
                msg.reply("Cannot find you in my database!");
            }
        });
    } else {
        msg.reply("Oops, you may have used that wrong, proper usage is: ``" + config.prefix + exports.info.usage + "``");
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