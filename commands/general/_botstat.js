const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const low = module.require('lowdb')
const FileSync = module.require('lowdb/adapters/FileSync')

exports.run = function (bot, msg, args) {
    var db = low(new FileSync('stats.json'))
    db.defaults({ messagesSeen: 0, messagesProcessed: 0, users: [] }).write();
    
    var now = new Date();
    var onlineSince = now - bot.uptime
    var embFeilds = [
        {
            name: "Discord Connection\nStatus",
            value: bot.status.toString() + " => " + config.statuses[bot.status],
            inline: true
        },
        {
            name: "Uptime",
            value: "Online since\n" + new Date(onlineSince).toLocaleString(),
            inline: true
        },
        {
            name: "Messages Seen",
            value: db.get("messagesSeen").toString(),
            inline: true
        },
        {
            name: "Messages Processed",
            value: db.get("messagesProcessed").toString(),
            inline: true
        },
        {
            name: "Current Heartbeat\nPing",
            value: bot.ping.toString(),
            inline: true
        }
    ]
    bot.pings.forEach((ping, index) => {
        embFeilds.push({
            name: "Past Heartbeat\nPing #" + (index + 1),
            value: ping.toString(),
            inline: true
        })
    })
    msg.channel.send({
        embed: {
            color: 6697881,
            author: {
                name: "Bot Status"
            },
            thumbnail: {
                url: bot.user.avatarURL
            },
            fields: embFeilds,
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.tag
            }
        }
    });
}

exports.info = {
    name: 'botstat',
    usage: 'botstat',
    description: 'Gets the current status of the bot',
    category: "general"
};