const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music) {
    music.join(msg);
}

exports.info = {
    name: 'join',
    usage: 'join',
    description: 'Joins the user\'s channel to play music.',
    category: "music"
};