const Discord = module.require("discord.js");
const config = module.require('../../config.json');

var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');

exports.run = function (bot, msg, args) {
	if (args[1] == undefined || args[1] == "help" || args[1] == "") {
        msg.channel.send({
            embed: {
                color: 6697881,
                author: {
                    name: "Hamburger Help"
                },
                title: "Hamburger format:",
                fields: [
                    {
                    "name": "How it works",
                    "value": "Type these keys on any order you want to create a hamburger."
                    },
                    {
                        "name": "\"ham\"",
                        "value": "Top bun"
                    },
                    {
                        "name": "\"b\"",
                        "value": "Lettuce"
                    },
                    {
                        "name": "\"u\"",
                        "value": "Tomato"
                    },
                    {
                        "name": "\"r\"",
                        "value": "Patty"
                    },
                    {
                        "name": "\"ger\"",
                        "value": "Bottom bun"
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
        var burgerID = makeBurgerid();
        msg.channel.send(`Compiling ${burgerID}...`);
        var order = [];
        var input = args[1];
        var validOrder = true;

        var newDir = "";
        var newDirA = __dirname.split('/');
        newDirA.pop();
        newDirA.pop();
        newDirA.forEach(dir => {
            newDir += dir + "/"
        });

        for (var i = 0; i < input.length; i++) {
            if (input[i] == "h" && input[i+1] == "a" && input[i+2] == "m") {
                order.push(newDir+"hamburger/ham.wav");
                i += 2;
            } else if (input[i] == "g" && input[i+1] == "e" && input[i+2] == "r") {
                order.push(newDir+"hamburger/ger.wav");
                i += 2;
            } else if (input[i] == "b") {
                order.push(newDir+"hamburger/b.wav");
            } else if (input[i] == "u") {
                order.push(newDir+"hamburger/u.wav");
            } else if (input[i] == "r") {
                order.push(newDir+"hamburger/r.wav");
            } else {
                msg.channel.send(`\`\`\`\n${input}\r${" ".repeat(i)}^ Cannot find ingredient "${input[i]}"\n\`\`\``);
                validOrder = false;
                break;
            }
        }
        
        if (validOrder) {
            msg.channel.send(`Building ${burgerID}...`);
            var finalFile = ffmpeg();
            order.forEach(path => {
                finalFile = finalFile.input(path);
            });
            finalFile.mergeToFile(burgerID + '.wav').on('end', function() {
                msg.channel.send(`Done building ${burgerID}!`, {
                    files: [{
                        attachment: newDir + burgerID + '.wav',
                        name: burgerID + ".wav"
                    }]
                }).then(() => {
                    fs.unlinkSync(newDir + burgerID + '.wav');
                });
            });;
        }
    }
}

exports.info = {
    name: 'hamburger',
    usage: 'hamburger [new string in hamburger format]\n' + config.prefix + 'hamburger help',
    description: 'Creates a new audio file out of the hamburger meme',
    category: "audio"
};

var makeBurgerid = () => {
    var result = 'burger#';
    var chars = '0123456789';
    for (var i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
