const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    if (args[1] == undefined || args[2] == undefined) {
        msg.channel.send("You must specify a type and text like: \n``" + exports.info.usage + "``");
        return;
    }
    msg.channel.send("Requested Mark: " + args[1] + " " + args[2]);
    bot.fetchUser(config.ownerID).then((user) => user.send("<@" + config.ownerID + "> Mark Requested: \nType: " + args[1] + "\nText: " + args[2]));
    console.log(msg.author.username + " requested mark bug: " + args[1] + " " + args[2]);
}

exports.info = {
    name: 'mark',
    usage: 'mark "[type (watching/playing/listening)]" "[text]"',
    description: 'Requests a new mark to be added to the bot',
    category: "mark"
};