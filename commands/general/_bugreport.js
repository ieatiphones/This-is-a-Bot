const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    msg.author.send("Thanks for reporting a bug! The bug will be reviewed and fixed in the near future so look out!");
    bot.fetchUser(config.ownerID).then((user) => user.send("<@" + config.ownerID + "> Bug Reported: " + args[1]));
    console.log(msg.author.username + " report bug: " + args[1]);
}

exports.info = {
    name: 'bugreport',
    usage: 'bugreport "[bug]"',
    description: 'Reports a bug to <@' + config.ownerID + '>',
    category: "general"
};