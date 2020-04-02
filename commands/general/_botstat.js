const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat) {

    stat.findOne({ type: "BOTPRIV" }, (err, res) => {
        if (err) return;

        var ms = "0";
        var mp = "0";

        if (res) {
            ms = res.messagesSeen.toString()
            mp = res.messagesProcessed.toString()
        }

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
                value: ms,
                inline: true
            },
            {
                name: "Messages Processed",
                value: mp,
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
    });
}

exports.info = {
    name: 'botstat',
    usage: 'botstat',
    description: 'Gets the current status of the bot',
    category: "general"
};