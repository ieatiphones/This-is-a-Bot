const Discord = module.require("discord.js");
const config = module.require('../config.json');
const fs = require('fs');
var request = require('request');

var effects = new Discord.Collection();

var userImages = [];

exports.init = function () {
    fs.readdir(`${appRoot}/innerImageEditor/effects/`, (err, fls) => {
        if (err) console.log(err);
    
        var effectsList = fls.filter(file => file.split(".").pop() == "js");
    
        if (effectsList.length < 1) {
            console.error("No effects found.");
            return;
        }
    
        effectsList.forEach(name => {
            try {
                var effect = require(`${appRoot}/innerImageEditor/effects/${name}`);
                effects.set(name, effect);
                console.log(`Loaded ${effect.info.name} effect`);
            } catch (e) {
                console.log(e);
            }
        })
    })
}

exports.invoke = function (bot, msg) {
    var content = msg.content.substring(config.iieprefix.length);

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
    if (args[0] == "image") {
        if (msg.attachments.size == 1) {
            var found = false;
            userImages.forEach((userImage, i) => {
                if (userImage.userid == msg.author.id) {
                    userImages[i].image = msg.attachments.first().url;
                    found = true;
                }
            });

            if (!found) userImages.push({"userid": msg.author.id, "image": msg.attachments.first().url});
            msg.reply("Registered your image!")
        } 
        else if (msg.attachments.size > 1) msg.reply("Found too many images, please try again with only 1 image attached.");
        else if (msg.attachments.size < 1) msg.reply("Didn't find any images in your request, please try again with an attached image.");
    } else if (args[0] == "imageurl") {
        if (args.length >= 2) {
            // if (!args[1].match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\b([/|.|\w|\s|-])*\.(?:jpg|gif|png))/)) {
            //     msg.reply("Couldn't find a valid URL, please list one with this command.");
            //     return;
            // }
            var found = false;
            userImages.forEach((userImage, i) => {
                if (userImage.userid == msg.author.id) {
                    userImages[i].image = arg[1];
                    found = true;
                }
            });

            if (!found) userImages.push({"userid": msg.author.id, "image": arg[1]});
            msg.reply("Registered your image!")
        } 
        else if (args.length < 2) msg.reply("Couldn't find your URL, please list one with this command.");
    } else if (args[0] == "effect") {
        msg.reply(`Attempting to apply effect "${args[1]}" to your image...`);

        var found = false;
        var foundIndex = 0;
        userImages.forEach((userImage, i) => {
            if (userImage.userid == msg.author.id) {
                found = true;
                foundIndex = i;
            } 
        });

        if (!found) {
            msg.reply("Could not find an image selected by you, please use ``$$$image`` with an attached image to select one.");
            return;
        }

        var effect = effects.find(effectI => effectI.info.name === args[1]);

        if (!effect) {
            msg.reply(`Could not find the effect named "${args[1]}"`);
            return;
        }

        var fileName = makeImageid();

        var filepath = `${appRoot}/innerImageEditor/imagecache/${fileName}.${userImages[foundIndex].image.split('.')[userImages[foundIndex].image.split('.').length - 1]}`
        var effectargs = args;
        effectargs.shift();
        effectargs.shift();

        request.head(userImages[foundIndex].image, (err, res, body) => {
            request(userImages[foundIndex].image).pipe(fs.createWriteStream(filepath)).on('close', () => {
                effect.apply(filepath, effectargs, e => {
                    if (e) { 
                        console.log(e);
                        msg.reply(`Failed to edit image:\n\`\`\`${e}\`\`\``);
                        fs.unlinkSync(filepath);
                        return;
                    }
                    msg.reply("Here is the edited image.", { 
                        files: [
                            filepath
                        ] 
                    }).then(msg => {
                        userImages.forEach((userImage, i) => {
                            if (userImage.userid == msg.author.id) userImages[i].image = msg.attachments.first().url;
                        });
                        fs.unlinkSync(filepath);
                    });
                });
            });
        });
    } else if (args[0] == "effecthelp") {
        var effect = effects.find(effectI => effectI.info.name === args[1]);

        if (!effect) {
            msg.reply(`Could not find the effect named "${args[1]}"`);
            return;
        }
        msg.reply(`Usage of "${args[1]}" effect: \`\`\`${effect.info.usage}\`\`\``);
    }
}

var makeImageid = () => {
    var result = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}