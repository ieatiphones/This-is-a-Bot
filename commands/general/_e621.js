const Discord = module.require("discord.js");
const config = module.require('../../config.json');

var Furry = require('e621');
var e621 = new Furry();

exports.run = function (bot, msg, args) {
    if (args[1] == undefined) {
        msg.reply("You must provide at least one tag to search by.")
        return;
    }
    // bot.channels.get(config.logsChannel).send(msg.author.tag + " asked for rule34");
    var query = msg.content.substring(6);
    console.log(msg.author.tag + " asked for e621 with tags: " + query);
    e621.getFurry(320, query, "FizzyApple12",).then((data) => {
        var randomNum = Math.floor(Math.random() * data.length)
        msg.reply("e621 image with tags: " + query, {
           file: data[randomNum].file_url,
        });
    });
}// $e621 female cat pussy score:>=200

exports.info = {
    name: 'e621',
    usage: 'e621 "[tags]"',
    description: 'Grabs an image off of e621.net',
    category: "images"
};