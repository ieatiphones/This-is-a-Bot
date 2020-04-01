const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music) {
    music.leave();
}

exports.info = {
    name: 'leave',
    usage: 'leave',
    description: 'Leaves the current music channel',
    category: "music"
};