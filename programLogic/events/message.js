const config = new require('../../config.json');

module.exports = async function (msg, DBI, music, IIE) {
    if (msg.author.id == bot.user.id) return;

    try {
        if (msg.mentions.everyone || msg.mentions.members.has(bot.user.id)) {
	        msg.react(bot.emojis.get('636983330973417492'));
        }
    } catch (e) {
        console.log("Could not find and/or add pingsock!");
    }

    try {
        if (msg.content != "" && msg.author.id != "460891988191870976") {
            console.log(`\"${msg}\"`);
            console.log(`^^ channel: ${msg.channel.name}, author: ${msg.author.tag}, guild: ${(msg.guild == null) ? "Direct Message" : msg.guild.name}`);
        }
    } catch (e) {
        console.log("[MESSAGE CONTENT] Error Retrieving Message Data!");
	    console.log(e);
    }

    try {
        var currentServerConfig = await DBI.serverPrefs.findOne({ id: msg.guild.id });
        if (currentServerConfig) {
            if (currentServerConfig.config.verificationChannel.set) {
                bot.verifications.forEach((userVer, index) => {
                    if (userVer.aid == msg.author.id) {
                        if (msg.content.toLowerCase() == userVer.vid) {
                            bot.verifications.splice(index, 1);
                            msg.reply(`Verified! Have fun at **${currentServerConfig.name}**`);
                            msg.member.removeRole(msg.guild.roles.get(currentServerConfig.config.verificationChannel.roleid));
                            if (currentServerConfig.config.verificationChannel.finalroleid != null) msg.member.addRole(msg.guild.roles.get(currentServerConfig.config.verificationChannel.finalroleid));
                        } else {
                            msg.member.removeRole(msg.guild.roles.get(currentServerConfig.config.verificationChannel.roleid));
                            var utk = msg.guild.members.find(member => member.id == msg.author.id);
                            if (utk && utk != null) utk.kick("Didn't pass verification.");
                            bot.verifications.splice(index, 1);
                        }
                    }
                });
            }

            DBI.serverPrefs.updateOne({ id: msg.guild.id }, { $set: { name: msg.guild.name } });

            if (currentServerConfig.config.locked) {
                msg.delete();
                return;
            }
        } else {
            DBI.serverPrefs.insertOne({
                "id": msg.guild.id,
                "name": msg.guild.name,
                "config": {
                    "moderatorRoles": {
                        "set": false,
                        "ids": []
                    },
                    "verificationChannel": {
                        "set": false,
                        "channelid": "",
                        "roleid": "",
                        "finalroleid": "",
                        "func": null
                    },
                    "welcomeChannel": {
                        "set": false,
                        "id": "",
                        "func": null
                    },
                    "nsfw": {
                        "allow": false,
                        "channelid": "",
                        "setChannel": false
                    },
                    "locked": false,
                    "pointName": "Server Point"
                }
            });
        }
    } catch (e) {
        console.log("Server config not found!");
    }

    try {
        DBI.stat.findOne({ id: msg.author.id }, (err, res) => {
            if (err) return;
            if (res) {
                var rank = res.rank;
                var xp = res.xp + msg.content.length;
                var level = res.level;

                var lup = recursiveLevelUp(xp, level);
                xp = lup[0];
                level = lup[1];

                config.rankProgression.forEach(rankI => {
                    if (res.level >= rankI.startLevel) rank = rankI.levelName;
                });

                DBI.stat.updateOne({ id: msg.author.id }, {
                    $set: {
                        xp: xp,
                        level: level,
                        username: msg.author.username,
                        iconurl: msg.author.avatarURL,
                        rank: rank
                    }
                });

                if (!res.serverPoints) {
                    var serverPoints = {};
                    if (msg.guild) serverPoints[msg.guild.id] = 0;

                    DBI.stat.updateOne({ id: msg.author.id }, {
                        $set: {
                            serverPoints: serverPoints
                        }
                    });
                } else if (msg.guild && !res.serverPoints[msg.guild.id]) {
                    var serverPoints = res.serverPoints;
                    serverPoints[msg.guild.id] = 0;

                    DBI.stat.updateOne({ id: msg.author.id }, {
                        $set: {
                            serverPoints: serverPoints
                        }
                    });
                }
            } else {
                var serverPoints = {};
                if (msg.guild) serverPoints[msg.guild.id] = 0;

                DBI.stat.insertOne({
                    id: msg.author.id,
                    level: 1,
                    xp: msg.content.length,
                    rank: "Newbie",
                    rankSP: "",
                    color: 0,
                    quote: "You can set your quote by using $quote",
                    username: msg.author.username,
                    iconurl: msg.author.avatarURL,
                    serverPoints: serverPoints
                });
            }
        });
    } catch (e) {
        console.log("User stats error!");
        console.log(e)
    }

    try {
        DBI.stat.findOne({ type: "BOTPRIV" }, (err, res) => {
            if (err) return;
            if (res) {
                DBI.stat.updateOne({ type: "BOTPRIV" }, {
                    $inc: {
                        messagesProcessed: (msg.content.startsWith(config.prefix)) ? 1 : 0,
                        messagesSeen: 1
                    }
                });
            } else {
                DBI.stat.insertOne({
                    type: "BOTPRIV",
                    messagesProcessed: (msg.content.startsWith(config.prefix)) ? 1 : 0,
                    messagesSeen: 1
                });
            }
        });
    } catch (e) {
        console.log("Bot stats error!")
    }

    if (!msg.content.startsWith(config.prefix) && !msg.content.startsWith(config.iieprefix)) return;

    var loadReact;

    var content = msg.content.substring(config.prefix.length);
    content = content.replace(/`/g, "");

    var args = [""];
    var speaking = false;

    for (let i = 0; i < content.length; i++) {
        if (content[i] == "\"") {
            speaking = !speaking;
            continue;
        }
        if (speaking) {
            args[args.length - 1] += content[i];
        } else {
            if (content[i] == " ") args.push("");
            else args[args.length - 1] += content[i];
        }
    }

    args[0] = args[0].toLowerCase();

    var pingedSomeone = false;

    args.forEach(arg => {
        if (arg.includes("@")) pingedSomeone = true;
    })

    if (pingedSomeone) {
        msg.channel.send('Sorry about this, but at the moment, you are not allowed to ping people in commands. Please check back later once a better fix has been completed.')
        return msg.react(bot.emojis.get('587386664012480522'));
    }

    var ownerCommand = bot.ownerCommands.find(command => command.info.name === args[0]);
    var generalCommand = bot.generalCommands.find(command => command.info.name === args[0]);
    var iieCommand = bot.iieCommands.find(command => command.info.name === args[0]);

    if (generalCommand || ownerCommand || iieCommand) {
        await msg.react(bot.emojis.get('660972734582358035')).then(r => {
            loadReact = r;
        });
    }

    if (ownerCommand) {
        if (msg.author.id == config.ownerID) {
            try {
                ownerCommand.run(bot, msg, args, DBI.stat, music, DBI.serverPrefs, loadReact, IIE);
                msg.react(bot.emojis.get('587386664104755210'));
	        } catch (e) {
		        msg.react(bot.emojis.get('587386664012480522'));
                msg.reply(`That command threw the error: \`\`\`${e}\`\`\``);
                console.log("COMMAND ERROR:");
                console.log(e);
            }
	        loadReact.remove();
            return;
        } else {
	        loadReact.remove();
	        msg.react(bot.emojis.get('587386664012480522'));
            msg.channel.send(`I'm sorry <@${msg.author.id}>, I'm afraid I cant let you do that.`);
            return;
        }
    }
    if (generalCommand) {
        try {
            generalCommand.run(bot, msg, args, DBI.stat, music, DBI.serverPrefs, loadReact, IIE);
	        msg.react(bot.emojis.get('587386664104755210'));
	    } catch (e) {
	        msg.react(bot.emojis.get('587386664012480522'));
            msg.reply(`That command threw the error: \`\`\`${e}\`\`\``);
            console.log("COMMAND ERROR:");
            console.log(e);
        }
	    loadReact.remove();
        return;
    }
    if (iieCommand) {
        try {
            iieCommand.run(() => {
	            loadReact.remove();
                msg.react(bot.emojis.get('587386664104755210'));
            }, bot, msg, args, IIE);
	    } catch (e) {
            loadReact.remove();
	        msg.react(bot.emojis.get('587386664012480522'));
            msg.reply(`That command threw the error: \`\`\`${e}\`\`\``);
            console.log("COMMAND ERROR:");
            console.log(e);
        }
        return;
    }
}

const recursiveLevelUp = (xp, level) => {
    var lxp = xp;
    var llevel = level;

    if (xp >= (llevel * config.xpCoefficient)) {
        lxp -= llevel * config.xpCoefficient;
        llevel += 1;
        var lup = recursiveLevelUp(lxp, llevel);
        lxp = lup[0];
        llevel = lup[1];
    }
    return [lxp, llevel];
}