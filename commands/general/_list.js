const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music) {
    var songList = [];
    songList += music.list();
    var songs = [];

    songList.forEach((song, index) => {
        songs.push({
            "name": "Song #" + index,
            "value": song
        });
    });
    msg.channel.send({
        embed: {
            color: 6697881,
            author: {
                name: "Music"
            },
            fields: songs,
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.tag + " | " + music.list().length + " in queue."
            }
        }
    });
}

exports.info = {
    name: 'list',
    usage: 'list',
    description: 'Checks what song is currently playing',
    category: "music"
};