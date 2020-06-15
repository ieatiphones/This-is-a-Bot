const { floor } = require("mathjs");

const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stats, music, serverPrefs) {
    if (msg.author.id != config.ownerID) {
        msg.channel.send("How about no <@!" + msg.author.id + ">?");
        return;
    }

    var personToModify;
    var pointModification;

    if (args[1]) {
        var id = "";
        id = args[1];
        if (id.includes("<@!")) {
            id = id.replace("<@!", "");
            id = id.replace(">", "");
        }
        bot.users.find(user => {
            var dtc = user.username + "#" + user.discriminator
            if (dtc == args[1]) id = user.id;
            return dtc == args[1]
        });
        personToModify = id;
    } else return msg.channel.send("No user specified, please specify a user to remove points from.");

    if (args[2] && !isNaN(args[2])) pointModification = parseInt(args[2]);
    else return msg.channel.send("No number specified, please specify the number of points to remove from the user.");

    if (pointModification <= 1) return msg.channel.send("You must specify a positive number of points to remove from the user.");

    try {
        serverPrefs.findOne({ id: msg.guild.id }, (err2, res2) => {
            if (err2 || !res2) return msg.channel.send('You are not inside a server, please move to a server and try again.');
            else {
                var modifications = {};
                modifications[`serverPoints.${msg.guild.id}`] = -pointModification;
                stats.updateOne({ id: msg.author.id }, {
                    $inc: modifications
                });
            }
        });
    } catch (e) {
        msg.channel.send('You are not inside a server, please move to a server and try again.');
    }

    msg.channel.send(`Removed ${pointModification} point${(pointModification == 1) ? '' : 's'} from <@!${personToModify}>!`);
}

exports.info = {
    name: 'removepoints',
    usage: 'removepoints "[id or tag]" [number of points]',
    description: 'Removes server points from a user.',
    category: "economy"
};