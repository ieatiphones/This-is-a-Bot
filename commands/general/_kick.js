const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    if (msg.author.id != config.ownerID) {
        msg.channel.send("How about no <@" + msg.author.id + ">?");
        return;
    }

    var personToKick;
    var personToKickName;

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
        personToKick = id;
    } else {
        msg.channel.send("No user specified, please specify a user to kick.");
        return;
    };
    var kickReason;

    if (args[2]) kickReason = args[2];
    else kickReason = "No reason specified."

    bot.users.find(user => {
        if (user.id == personToKick) {
            personToKickName = user.username;
            var utk = msg.guild.members.find(member => member.id == user.id);
            
            if (utk && utk != null) utk.kick(kickReason);
        }
        return user.id == personToKick
    });

    msg.channel.send({
        embed: {
            color: 6697881,
            title: "**KICKED USER:**\n" + personToKickName,
            fields: [
                {
                    name: "Reason:",
                    value: "```" + kickReason + "```"
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
    name: 'kick',
    usage: 'kick "[id or tag]" "{reason}"',
    description: 'Kicks user from server.',
    category: "moderation"
};