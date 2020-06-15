const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music, serverPrefs) {
    var content = msg.content.substring(config.prefix.length);

    var personToCheck;

    if (args[1]) {
        var id = "";
        id = args[1];
        if (id.includes("<@!")) {
            id = id.replace("<@!", "");
            id = id.replace(">", "");
        }
        bot.users.find(user => {
            var dtc = user.username + "#" + user.discriminator
            if (dtc == content.substring(6)) {
                id = user.id;
            }
            return dtc == args[1]
        });
        personToCheck = id;
    }
    else personToCheck = msg.author.id;

    stat.findOne({ id: personToCheck }, (err, res) => {
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
            msg.reply("Cannot find that user in my database. Check your id or tag");
        }
    });
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

exports.info = {
    name: 'check',
    usage: 'check {id or tag of user}',
    description: 'Checks your statistics',
    category: "stats"
};
