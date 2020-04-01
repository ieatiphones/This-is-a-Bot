const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music) {
    msg.channel.send("Toggled repeat to " + music.toggleRepeat());
}

exports.info = {
    name: 'repeat',
    usage: 'repeat',
    description: 'Toggles the option to repeat the current song.',
    category: "music"
};