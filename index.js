const Discord = require('discord.js');
global.bot = new Discord.Client();
const config = new require('./config.json');
const configPrivate = new require('./configPrivate.json');
const fs = require('fs');
const readline = require('readline');

// const IIEconfig = new require('./config.json');
// const IIE = require('./innerImageEditor/index.js');
// IIE.init();

global.appRoot = __dirname
global.appMain = __filename

var music = require('./music.js');
music.init();

var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
const btoa = require('btoa');
var fetch = require('node-fetch');

const MongoClient = require('mongodb').MongoClient;
var mongoDB;
var stat;
var serverPrefs;
var webPanelUsers;

MongoClient.connect(config.mongodb.dbUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) return;
    console.log('Conencted to MongoDB');

    mongoDB = client.db(config.mongodb.dbName);
    stat = mongoDB.collection(config.mongodb.statsDB);
    serverPrefs = mongoDB.collection(config.mongodb.serverPrefsDB);
    webPanelUsers = mongoDB.collection(config.mongodb.webPanelUsersDB);
});

bot.generalCommands = new Discord.Collection();
bot.ownerCommands = new Discord.Collection();

var spaces = 0;
var verifications = [];

fs.readdir("./commands/general", (err, fls) => {
    if (err) console.log(err);

    var commands = fls.filter(file => file.split(".").pop() == "js");

    if (commands.length < 1) {
        console.error("No general commands found.");
        return;
    }

    commands.forEach((name, i) => {
        if (name.length + 5 > spaces) spaces = name.length + 5;
    })

    commands.forEach((name, i) => {
        var finalSpaces = "";
        for (var i = 0; i < spaces - name.length; i++) {
            finalSpaces += " "
        }
        process.stdout.write(`Loading General Command: ${name} `);
        try {
            var command = require(`./commands/general/${name}`);
            bot.generalCommands.set(name, command);
            console.log('\x1b[32m%s\x1b[0m', finalSpaces + 'OK')
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', finalSpaces + 'FAIL')
        }
    })
})
fs.readdir("./commands/owner", (err, fls) => {
    if (err) console.log(err);

    var commands = fls.filter(file => file.split(".").pop() == "js");

    if (commands.length < 1) {
        console.error("No owner commands found.");
        return;
    }

    commands.forEach((name, i) => {
        if (name.length + 5 > spaces) spaces = name.length + 5;
    })

    commands.forEach((name, i) => {
        var finalSpaces = "";
        for (var i = 0; i < spaces + 2 - name.length; i++) {
            finalSpaces += " "
        }
        process.stdout.write(`Loading Owner Command: ${name} `);
        try {
            var command = require(`./commands/owner/${name}`);
            bot.ownerCommands.set(name, command);
            console.log('\x1b[32m%s\x1b[0m', finalSpaces + 'OK')
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', finalSpaces + 'FAIL')
        }
    })
})

bot.on('message', async (msg) => {
    if (msg.author.id == config.botID) return;

    try {
        if (msg.mentions.everyone || msg.mentions.members.has(bot.user.id)) {
	    msg.react(bot.emojis.get('636983330973417492'));
        }
    } catch (e) {
        console.log("Could not find and/or add pingsock!");
    }

    try {
        var channelid = msg.channel.id;

        if (msg.content != "" && msg.author.id != "460891988191870976") {
            console.log("[MESSAGE CONTENT] >> \"" + msg + "\"");
            console.log(`^^ { channelid: ${channelid}, authorid: ${msg.author.id}, guildName: ${(msg.guild == null) ? "Direct Message" : msg.guild.name} }`);
        }
    } catch (e) {
        console.log("[MESSAGE CONTENT] Error Retrieving Message Data!");
	console.log(e);
    }

    try {
        var currentServerConfig = await serverPrefs.findOne({ id: msg.guild.id });
        if (currentServerConfig) {
            if (currentServerConfig.config.verificationChannel.set) {
                verifications.forEach((userVer, index) => {
                    if (userVer.aid == msg.author.id) {
                        if (msg.content.toLowerCase() == userVer.vid) {
                            verifications.splice(index, 1);
                            msg.reply("Verified! Have fun at **" + currentServerConfig.name + "**");
                            msg.member.removeRole(msg.guild.roles.get(currentServerConfig.config.verificationChannel.roleid));
                            if (currentServerConfig.config.verificationChannel.finalroleid != null) msg.member.addRole(msg.guild.roles.get(currentServerConfig.config.verificationChannel.finalroleid));
                        } else {
                            msg.member.removeRole(msg.guild.roles.get(currentServerConfig.config.verificationChannel.roleid));
                            var utk = msg.guild.members.find(member => member.id == msg.author.id);
                            if (utk && utk != null) utk.kick("Didn't pass verification.");
                            verifications.splice(index, 1);
                        }
                    }
                });
            }

            if (currentServerConfig.config.locked) {
                msg.delete();
                return;
            }
        } else {
            serverPrefs.insertOne({
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
                    "locked": false
                }
            });
        }
    } catch (e) {
        console.log("Server config not found!");
    }

    try {
        stat.findOne({ id: msg.author.id }, (err, res) => {
            if (err) return;
            if (res) {
                var rank = res.rank;
                var xp = res.xp + msg.content.length;
                var level = res.level;

                var lup = recursiveLevelUp(xp, level);
                xp = lup[0];
                level = lup[1];

                config.rankProgression.forEach(rank => {
                    if (res.level >= rank.startLevel)
                        rank = rank.levelName;
                });

                stat.updateOne({ id: msg.author.id }, {
                    $set: {
                        xp: xp,
                        level: level,
                        username: msg.author.username,
                        iconurl: msg.author.avatarURL,
                        rank: rank
                    }
                });
            } else {
                stat.insertOne({
                    id: msg.author.id,
                    level: 1,
                    xp: msg.content.length,
                    rank: "Newbie",
                    rankSP: "",
                    color: 0,
                    quote: "You can set your quote by using $quote",
                    username: msg.author.username,
                    iconurl: msg.author.avatarURL
                });
            }
        });
    } catch (e) {
        console.log("User stats error!");
        console.log(e)
    }

    try {
        stat.findOne({ type: "BOTPRIV" }, (err, res) => {
            if (err) return;
            if (res) {
                stat.updateOne({ type: "BOTPRIV" }, {
                    $inc: {
                        messagesProcessed: (msg.content.startsWith(config.prefix)) ? 1 : 0,
                        messagesSeen: 1
                    }
                });
            } else {
                stat.insertOne({
                    type: "BOTPRIV",
                    messagesProcessed: (msg.content.startsWith(config.prefix)) ? 1 : 0,
                    messagesSeen: 1
                });
            }
        });
    } catch (e) {
        console.log("Bot stats error!")
    }

    // if (msg.content.startsWith("$$$")) {
    //     IIE.invoke(bot, msg);
    //     return;
    // }

    if (!msg.content.startsWith(config.prefix)) return;

    var loadReact;
    var readyToProcess = false;
    /*
    await msg.react(bot.emojis.get('660972734582358035')).then(r => {
        loadReact = r;
	readyToProcess = true;
    });
    */

    //while (!readyToProcess) {}

    var content = msg.content.substring(config.prefix.length);

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

    var ownerCommand = bot.ownerCommands.find(command => command.info.name === args[0]);
    var generalCommand = bot.generalCommands.find(command => command.info.name === args[0]);

    if (generalCommand || ownerCommand) {
        await msg.react(bot.emojis.get('660972734582358035')).then(r => {
            loadReact = r;
            readyToProcess = true;
        });
    }

    if (ownerCommand) {
        if (msg.author.id == config.ownerID) {
            try {
                ownerCommand.run(bot, msg, args, stat, music, serverPrefs);
                msg.react(bot.emojis.get('587386664104755210'));
	    } catch (e) {
		msg.react(bot.emojis.get('587386664012480522'));
                msg.reply("That command threw the error: ```" + e + "```");
                console.log("COMMAND ERROR:");
                console.log(e);
            }
	    loadReact.remove();
            return;
        } else {
	    loadReact.remove();
	    msg.react(bot.emojis.get('587386664012480522'));
            msg.channel.send("I'm sorry <@" + msg.author.id + ">, I'm afraid I cant let you do that.");
            return;
        }
    }
    if (generalCommand) {
        try {
            generalCommand.run(bot, msg, args, stat, music, serverPrefs);
	    msg.react(bot.emojis.get('587386664104755210'));
	} catch (e) {
	    msg.react(bot.emojis.get('587386664012480522'));
            msg.reply("That command threw the error: ```" + e + "```");
            console.log("COMMAND ERROR:");
            console.log(e);
        }
	loadReact.remove();
        return;
    }
});

var recursiveLevelUp = (xp, level) => {
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

process.on('uncaughtException', (e) => {
    console.log(e);
});

bot.on('messageReactionAdd', (reaction, user) => {
    //if (user.bot) return;
    //commands.unoPlay.execute(reaction, user)
});

bot.on('guildMemberAdd', async member => {
    try {
        var currentServerConfig = await serverPrefs.findOne({ id: member.guild.id });
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
                            "value": "^^ <@" + member.id + "> Send the code above ^^"
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
            verifications.forEach((verif, index) => {
                if (verif.vid != verificationID) nvarray.push(verif);
            });

            verifications = nvarray;

            verifications.push({
                "vid": verificationID,
                "aid": member.id
            });
        }

        if (currentServerConfig.config.welcomeChannel.set) {
            var welcomeMessge = config.welcomes[Math.floor(Math.random() * config.welcomes.length)];
            welcomeMessge = welcomeMessge.replace("@", "<@" + member.id + ">");
            member.guild.channels.get(currentServerConfig.config.welcomeChannel.id).send(welcomeMessge);
        }
    } catch (e) {
        console.log(e);
    }
});


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    //music.init();

    //bot.user.setActivity('my depression', { type: 'watching' })
    changeColor()
    setInterval(changeColor, 120000);
    unAfk();
    setInterval(unAfk, 60000);
    changeMark();
    setInterval(changeMark, 90000);
    // RPC.updatePresence({
    //     state: 'test',
    //     details: 'test',
    //     startTimestamp: Date.now(),
    //     endTimestamp: Date.now() + 1337,
    //     largeImageKey: 'bot-icon',
    //     smallImageKey: 'bot-icon',
    //     instance: true,
    // });
});

var unAfk = () => {
    var unAfkMsg = `Status: ${bot.status} => ${config.statuses[bot.status]}\nPing: ${bot.ping}`;

    bot.fetchUser("313385355049041921").then(userToAfk => {
        userToAfk.createDM().then(dmChannel => {
            dmChannel.send(unAfkMsg);
            dmChannel.startTyping();
            setTimeout(() => {
                dmChannel.stopTyping();
            }, 30000);
        })
    });
}

var changeColor = () => {
    bot.guilds.array().forEach((guild, index1) => {
        guild.me.roles.forEach((role, index2) => {
            if (role.name.toLowerCase().includes("this is a bot")) {
                role.setColor(6697881).catch(() => {

                })
            }
        })
    })
}

var changeMark = () => {
    var act = config.marks[Math.floor(Math.random() * config.marks.length)];
    bot.user.setActivity(act.text, { type: act.type })
}

var makeVerifictionid = () => {
    var result = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    var args = input.split(" ");
    var cmd = args[0].toLowerCase();

    if (cmd == "say") {
        var message = "";
        args.forEach((word, index) => {
            if (index > 1)
                message += word + " ";
        });

        bot.channels.get(args[1]).send(message);
        bot.channels.get(args[1]).stopTyping();
    } else if (cmd == "typing") {
        if (args[1] == "start") {
            bot.channels.get(args[2]).startTyping();
        } else if (args[1] == "stop") {
            bot.channels.get(args[2]).stopTyping();
        }
    }
});

bot.login(configPrivate.token).catch(e => {
    console.log(e);
});


app.set('view engine', 'ejs');

app.use("/assets/", express.static('panel/assets/'));
app.use("/js/", express.static('panel/js/'));
app.use("/css/", express.static('panel/css/'));

const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch(err => next(err));
    }
});

app.get('/', catchAsync(async (req, res) => {
    console.log('[CONNECTION]');
    console.log('    IP: ' + req.ip);
    console.log('    Port: ' + req.connection.remotePort);
    console.log('    Family: ' + req.connection.remoteFamily);
    console.log('    Method: ' + req.method);
    console.log('    Path: ' + req.path);
    console.log('    Code: ' + req.query.code);

    fs.readFile('connections.txt', (err, data) => {
        data += '\n[CONNECTION]\n    IP: ' + req.ip + '\n    Port: ' + req.connection.remotePort + '\n    Family: ' + req.connection.remoteFamily + '\n    Method: ' + req.method + '\n    Path: ' + req.path
        fs.writeFileSync('connections.txt', data);
    });

    var selectedMOTD = config.motds[Math.floor(Math.random() * config.motds.length)];
    var newMOTD = "";
    var command = "";
    var inCommand = false;

    for (let i = 0; i < selectedMOTD.length; i++) {
        if (selectedMOTD[i] == undefined) continue;
        if (selectedMOTD[i] == "{") {
            inCommand = true;
        }
        if (inCommand) {
            command += selectedMOTD[i];
        } else {
            newMOTD += selectedMOTD[i];
        }
        if (selectedMOTD[i] == "}") {
            command = command.replace('{', '');
            command = command.replace('}', '');
            newMOTD += MOTDcommand(command);
            inCommand = false;
        }
    }

    var selectedMOTD = newMOTD;

    if (!req.query.code) {
        res.render(__dirname + '/panel/index', {
            SessionID: null,
            motd: selectedMOTD
        });
        return;
    }
    const code = req.query.code;
    const creds = btoa(`${config.clientid}:${configPrivate.clientsecret}`);
    const authReq = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=http%3A%2F%2Fthisisabot.com%2F`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            },
        });
    const authJson = await authReq.json();

    if (authJson.access_token) {
        const userRes = await fetch(`http://discordapp.com/api/users/@me`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authJson.access_token}`,
                },
            });
        var finalJson = await userRes.json();
        finalJson.token = {
            token: authJson.access_token,
            sessionid: makeSessionid()
        }
        webPanelUsers.findOne({ id: finalJson.id }, (err, res) => {
            if (err) return;
            if (res) {
                webPanelUsers.updateOne({ id: finalJson.id }, {
                    $set: {
                        token: {
                            token: authJson.access_token,
                            sessionid: makeSessionid()
                        }
                    }
                })
            } else {
                webPanelUsers.insertOne(finalJson);
            }
        });
        res.render(__dirname + '/panel/index', {
            SessionID: finalJson.token.sessionid,
            motd: selectedMOTD
        });
    } else {
        res.render(__dirname + '/panel/index', {
            SessionID: null,
            motd: selectedMOTD
        });
    }
}));

app.get('/api/', catchAsync(async (req, res) => {
    console.log('[CONNECTION]');
    console.log('    IP: ' + req.ip);
    console.log('    Port: ' + req.connection.remotePort);
    console.log('    Family: ' + req.connection.remoteFamily);
    console.log('    Method: ' + req.method);
    console.log('    Path: ' + req.path);

    res.render(__dirname + '/panel/docsreal', {});
}));

app.get('/game/', catchAsync(async (req, res) => {
    console.log('[CONNECTION]');
    console.log('    IP: ' + req.ip);
    console.log('    Port: ' + req.connection.remotePort);
    console.log('    Family: ' + req.connection.remoteFamily);
    console.log('    Method: ' + req.method);
    console.log('    Path: ' + req.path);

    res.render(__dirname + '/panel/game', {});
}));

app.get('/userdata', catchAsync(async (req, res) => {
    if (!req.headers || !req.headers.sessionid) {
        res.sendStatus(404);
        return
    }
    webPanelUsers.findOne({ token: { sessionid: req.headers.sessionid } }, async (err, dres) => {
        if (err) {
            res.sendStatus(404);
            return;
        }
        if (dres) {
            const userRes = await fetch(`http://discordapp.com/api/users/@me`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${dres.token.token}`,
                    },
                });
            var finalJson = await userRes.json();
            if (finalJson.code != undefined && finalJson.code == 0) {
                res.sendStatus(404);
            } else {
                res.set("Content-Type", "application/json");
                res.send(finalJson);
            }
        } else {
            res.sendStatus(404);
        }
    })
}));

app.get('/userdata/servers', catchAsync(async (req, res) => {
    if (!req.headers || !req.headers.sessionid) {
        res.sendStatus(404);
        return
    }

    webPanelUsers.findOne({ token: { sessionid: req.headers.sessionid } }, async (err, dres) => {
        if (err) {
            res.sendStatus(404);
            return;
        }
        if (dres) {
            const userRes = await fetch(`http://discordapp.com/api/users/@me`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${dres.token.token}`,
                    },
                });
            var userResJson = await userRes.json();
            const serverRes = await fetch(`http://discordapp.com/api/users/@me/guilds`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${dres.token.token}`,
                    },
                });
            var serverResJson = await serverRes.json();
            var finalJson = [];
            serverResJson.forEach(server => {
                if (bot.guilds.get(server.id) && bot.guilds.get(server.id).member(config.botID)) {
                    if (userResJson.id == config.ownerID) {
                        finalJson.push(server);
                    } else if (server.owner) {
                        finalJson.push(server);
                    }
                }
            });
            if (finalJson.code != undefined && finalJson.code == 0) {
                res.sendStatus(404);
            } else {
                res.set("Content-Type", "application/json");
                res.send(finalJson);
            }
        } else {
            res.sendStatus(404);
        }
    });
}));

app.get('/api/stats/stats/:userid', catchAsync(async (req, res) => {
    console.log('Grabbed stats for user: ' + req.params.userid);
    stat.findOne({ id: req.params.userid }, (err, res) => {
        if (err) return;
        if (res) {
            res.set("Content-Type", "application/json");
            res.send(res);
        } else {
            res.sendStatus(404);
        }
    });
}));

app.get('/api/stats/card/:userid', catchAsync(async (req, res) => {
    console.log('Grabbed stats card for user: ' + req.params.userid);
    stat.findOne({ id: req.params.userid }, (err, res) => {
        if (err) return;
        if (res) {
            var totalXP = res.xp;
            for (var j = 0; j < res.level - 1; j++) {
                totalXP += (res.level * config.xpCoefficient);
            }
    
            res.set("Content-Type", "application/json");
            res.send({
                embed: {
                    color: res.color,
                    title: "\"" + res.quote + "\"",
                    author: {
                        name: res.username
                    },
                    thumbnail: {
                        url: res.iconurl
                    },
                    fields: [
                        {
                            name: "Level",
                            value: res.level
                        },
                        {
                            name: "XP",
                            value: res.xp + "/" + (res.level * config.xpCoefficient) + "\nTotal: " + totalXP + "XP"
                        },
                        {
                            name: "Rank(s)",
                            value: res.rank + "\n" + res.rankSP
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: bot.user.tag
                    }
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
}));

server.listen(80, () => {
    console.log('listening on *:80');
});

var makeSessionid = () => {
    var result = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 24; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

var MOTDcommand = (command) => {
    var output = "";
    var args = command.split(',');

    if (args[0] == '1') {
        output = bot.guilds.array().length;
    } else if (args[0] == '2') {
        output = bot.guilds.array()[Math.floor(Math.random() * bot.guilds.array().length)].name;
    } else if (args[0] == '3') {
        output = Math.floor(Math.random() * (parseInt(args[1]) - parseInt(args[2])) + parseInt(args[2]));
    }

    return output;
}
