const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat) {
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
            sendCheckCard(msg, res, totalXP);
        } else {
            msg.reply("Cannot find that user in my database. Check your id or tag");
        }
    });
}

var sendCheckCard = (msg, userStats, totalXP) => {
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

exports.info = {
    name: 'check',
    usage: 'check {id or tag of user}',
    description: 'Checks your statistics',
    category: "stats"
};
