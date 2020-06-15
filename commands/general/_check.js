const Discord = module.require("discord.js");
const config = module.require('../../config.json');
const statUtils = module.require('../../programLogic/statsUtils');

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
                    if (err2 || !res2) msg.channel.send(statUtils.generateCard(msg, res, totalXP, false, null));
                    else msg.channel.send(statUtils.generateCard(msg, res, totalXP, true, res2));
                });
            } catch (e) {
                msg.channel.send(statUtils.generateCard(msg, res, totalXP, false, null));
            }
        } else {
            msg.reply("Cannot find that user in my database. Check your id or tag");
        }
    });
}

exports.info = {
    name: 'check',
    usage: 'check {id or tag of user}',
    description: 'Checks your statistics',
    category: "stats"
};
