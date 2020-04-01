const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const request = require("request");

exports.run = function (bot, msg, args) {
    console.log(msg.author.tag + " searched for a picture with query " + args[1] + " from Imgur");
    var query = args[1].replace(/ /g, '+');
    request({ url: 'https://api.imgur.com/3/gallery/search?q=' + query, headers: { 'Authorization': 'Client-ID 9b737057c864c9b' } }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            msg.reply("Imgur search " + args[1] + ": ", {
                file: info.data[0].images[0].link,
            });
        }
    });
}

exports.info = {
    name: 'imgurtop',
    usage: 'imgurtop "[query]"',
    description: 'Returns the top imgur result using the specified query',
    category: "images"
};