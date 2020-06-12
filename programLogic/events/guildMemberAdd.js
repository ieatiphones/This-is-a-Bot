module.exports = async function (member, DBI) {
    try {
        var currentServerConfig = await DBI.serverPrefs.findOne({ id: member.guild.id });
        if (!currentServerConfig) return;
        var verificationID = makeVerifictionid();

        if (currentServerConfig.config.verificationChannel.set) {
            member.addRole(member.guild.roles.get(currentServerConfig.config.verificationChannel.roleid));
            member.guild.channels.get(currentServerConfig.config.verificationChannel.channelid).send({
                embed: {
                    color: 6697881,
                    author: {
                        name: "Verification"
                    },
                    fields: [
                        {
                            "name": verificationID,
                            "value": `^^ <@${member.id}> Send the code above ^^`
                        },
                        {
                            "name": "What happens if I don't?",
                            "value": "If you type something else, you will be kicked."
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: bot.user.tag + " | Bot Protection"
                    }
                }
            });

            var nvarray = [];
            bot.verifications.forEach((verif, index) => {
                if (verif.vid != verificationID) nvarray.push(verif);
            });

            bot.verifications = nvarray;

            bot.verifications.push({
                "vid": verificationID,
                "aid": member.id
            });
        }

        if (currentServerConfig.config.welcomeChannel.set) {
            var welcomeMessge = config.welcomes[Math.floor(Math.random() * config.welcomes.length)];
            welcomeMessge = welcomeMessge.replace("@", `<@${member.id}>`);
            member.guild.channels.get(currentServerConfig.config.welcomeChannel.id).send(welcomeMessge);
        }
    } catch (e) {
        console.log(e);
    }
}

const makeVerifictionid = () => {
    var result = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}