const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

exports.run = function (bot, msg, args) {
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

    var db = low(new FileSync('stats.json'))
    db.defaults({ messagesSeen: 0, messagesProcessed: 0, users: [] }).write();
    
    console.log(personToCheck);

    var user = db.get("users").find(user => user.id == personToCheck).value();

    if (user == undefined || user == null) {
        msg.reply("Cannot find that user in my database. Check your id or @ tag");
        return;
    }

    var totalXP = user.xp;
    for (var j = 0; j < user.level - 1; j++) {
        totalXP += (user.level * config.xpCoefficient);
    }
    config.rankProgression.forEach(rank => {
        if (user.level >= rank.startLevel)
            user.rank = rank.levelName;
    });
    db.get("users").find(user => user.id == personToCheck).set("rank", user.rank).write();
    sendCheckCard(msg, user, totalXP);
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
