const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    if (msg.author.id != config.ownerID) {
        msg.channel.send("How about no <@" + msg.author.id + ">?");
        return;
    }

    var personToBan;
    var personToBanName;

    if (args[1]) {
        var id = "";
        id = args[1];
        if (id.includes("<@")) {
            id = id.replace("<@", "");
            id = id.replace(">", "");
        }
        bot.users.find(user => {
            var dtc = user.username + "#" + user.discriminator
            if (dtc == args[1]) {
                id = user.id;
            }
            return dtc == args[1]
        });
        personToBan = id;
    } else {
        msg.channel.send("No user specified, please specify a user to ban.");
        return;
    };
    var banReason;

    if (args[2]) banReason = args[2];
    else banReason = "No reason specified."

    bot.users.find(user => {
        if (user.id == personToBan) {
            personToBanName = user.username;
            var utb = msg.guild.members.find(member => member.id == user.id);
            
            if (utb && utb != null) utb.ban(banReason);
        }
        return user.id == personToBan
    });

    msg.channel.send({
        embed: {
            color: 6697881,
            title: "**BANNED USER:**\n" + personToBanName,
            fields: [
                {
                    name: "Reason:",
                    value: "```" + banReason + "```"
                }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.tag
            }
        }
    });
}

exports.info = {
    name: 'ban',
    usage: 'ban "[id or tag]" "{reason}"',
    description: 'Bans user from server.',
    category: "moderation"
};