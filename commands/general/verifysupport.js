const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    if (msg.guild.id != "694401697703002192") return;
    msg.member.addRole("694406384841916486");
    msg.delete();
}

exports.info = {
    name: 'verifysupport',
    usage: null,
    description: null,
    category: null
};
