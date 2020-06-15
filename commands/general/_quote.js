const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music, serverPrefs) {
    if (args[1]) { //9437439
        stat.updateOne({ id: msg.author.id }, {
            $set: {
                quote: args[1]
            }
        });
        stat.findOne({ id: msg.author.id }, (err, res) => {
            if (err) msg.reply("Error retrieving data from MongoDB.");
            if (res) {
                var totalXP = res.xp;
                for (var j = 0; j < res.level - 1; j++) {
                    totalXP += (res.level * config.xpCoefficient);
                }
                try {
                    serverPrefs.findOne({ id: msg.guild.id }, (err2, res2) => {
                        if (err2 || !res2) sendCheckCard(msg, res, totalXP, false, null);
                        else sendCheckCard(msg, res, totalXP, true, res2);
                    });
                } catch (e) {
                    sendCheckCard(msg, res, totalXP, false, null);
                }
            } else {
                msg.reply("Cannot find you in my database!");
            }
        });
    } else {
        msg.reply("Oops, you may have used that wrong, proper usage is: ``" + config.prefix + exports.info.usage + "``");
    }
}

var sendCheckCard = (msg, userStats, totalXP, server, serverStats) => {
    var feilds = [
        {
            name: "Level",
            value: userStats.level
        },
        {
            name: "XP",
            value: userStats.xp + "/" + (userStats.level * config.xpCoefficient) + "\nTotal: " + totalXP + "XP"
        }
    ];

    if (server) feilds.push({
        name: `${serverStats.config.pointName}s (This Server's Currency)`,
        value: `${userStats.serverPoints[msg.guild.id]} ${serverStats.config.pointName}${(userStats.serverPoints[msg.guild.id] == 1) ? '' : 's'}`
    });

    feilds.push({
        name: "Rank(s)",
        value: userStats.rank + "\n" + userStats.rankSP
    });

    msg.channel.send({
        embed: {
            color: userStats.color,
            title: "\"" + userStats.quote + "\"",
            author: {
                name: userStats.username
            },
            thumbnail: {
                url: userStats.iconurl
            },
            fields: feilds,
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
    name: 'quote',
    usage: 'quote "[quote]"',
    description: 'Sets your quote',
    category: "stats"
};