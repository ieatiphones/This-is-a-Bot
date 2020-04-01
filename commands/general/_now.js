const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music) {
    msg.channel.send({
        embed: {
            color: 6697881,
            author: {
                name: "Music"
            },
            fields: [
                {
                    "name": "Now Playing:",
                    "value": music.now()
                }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.tag + " | " + music.list().length + " in queue."
            }
        }
    });
}

exports.info = {
    name: 'now',
    usage: 'now',
    description: 'Checks what song is currently playing',
    category: "music"
};