const config = module.require('../config.json');

exports.generateCard = (msg, userStats, totalXP, server, serverStats) => {
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

    return {
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
    }
}