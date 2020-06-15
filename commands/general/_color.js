const Discord = module.require("discord.js");
const config = module.require('../../config.json');
const statUtils = module.require('../../programLogic/statsUtils');

exports.run = function (bot, msg, args, stat, music, serverPrefs) {
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
                try {
                    serverPrefs.findOne({ id: msg.guild.id }, (err2, res2) => {
                        if (err2 || !res2) msg.channel.send(statUtils.generateCard(msg, res, totalXP, false, null));
                        else msg.channel.send(statUtils.generateCard(msg, res, totalXP, true, res2));
                    });
                } catch (e) {
                    msg.channel.send(statUtils.generateCard(msg, res, totalXP, false, null));
                }
            } else {
                msg.reply("Cannot find you in my database!");
            }
        });
    } else {
        msg.reply("Oops, you may have used that wrong, proper usage is: ``" + config.prefix + exports.info.usage + "``");
    }
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