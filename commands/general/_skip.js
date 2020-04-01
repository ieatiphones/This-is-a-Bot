const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music) {
    music.skip();
    msg.channel.send({
        embed: {
            color: 6697881,
            author: {
                name: "Music"
            },
            fields: [
                {
                    "name": "Started vote to skip song:",
                    "value": music.now()
                },
                {
                    "name": "How to vote:",
                    "value": `Click either the ${bot.emojis.get("587386664104755210")} or the ${bot.emojis.get("587386664012480522")} to vote`
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
    name: 'skip',
    usage: 'skip',
    description: 'Votes to skip the current song',
    category: "music"
};