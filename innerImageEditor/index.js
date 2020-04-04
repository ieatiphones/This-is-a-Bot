const Discord = module.require("discord.js");
const config = module.require('./config.json');
const fs = require('fs');
var request = require('request');

var effects = new Discord.Collection();

var userImages = [];

exports.init = function () {
    fs.readdir("./effects", (err, fls) => {
        if (err) console.log(err);
    
        var effectsList = fls.filter(file => file.split(".").pop() == "js");
    
        if (effectsList.length < 1) {
            console.error("No effects found.");
            return;
        }
    
        effectsList.forEach(name => {
            try {
                var effect = require(`./effects/${name}`);
                effects.set(name, effect);
            } catch (e) {}
        })
    })
}

exports.invoke = function (bot, msg, args) {
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
        } 
        else if (msg.attachments.size >= 1) msg.channel.send("IIE found too many images, please try again with only 1 image attached.");
        else if (msg.attachments.size <= 1) msg.channel.send("IIE didn't find any images in your request, please try again with an attached image.");
    } else if (args[0] == "effect") {
        msg.channel.send(`IIE is attempting to apply effect "${args[1]}" to your image...`);

        var found = false;
        var foundIndex = 0;
        userImages.forEach((userImage, i) => {
            if (userImage.userid == msg.author.id) {
                found = true;
                foundIndex = i;
            } 
        });

        if (!found) {
            msg.channel.send("IIE could not find an image selected by you, please use ``$$$image`` with an attached image to select one.");
            return;
        }

        var effect = effects.find(effectI => effectI.info.name === args[1]);

        if (!effect) {
            msg.channel.send(`IIE could not find the effect named "${args[1]}"`);
            //return;
        }

        var fileName = makeImageid();

        request.head(userImages[foundIndex].image, (err, res, body) => {
            request(userImages[foundIndex].image).pipe(fs.createWriteStream(`./imagecache/${fileName + userImages[foundIndex].image.split('.')[userImages[foundIndex].image.split('.').length - 1]}`)).on('close', () => {

            });
        });

        //effect.apply();
    } else {
        msg.channel.send("IIE cannot find the command specified.");
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