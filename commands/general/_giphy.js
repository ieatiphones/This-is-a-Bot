const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const request = require("request");

exports.run = function (bot, msg, args) {
    if (!args[1]) return msg.channel.send("You must provide tags to search by.")
    console.log(msg.author.tag + " asked for a picture about " + args[1] + " from Giphy");
    var query = args[1].replace(/ /g, '+');
    request('http://api.giphy.com/v1/gifs/random?tag=' + query + '&api_key=ox196Ej6TcRtsGmP6ICDAXyPVepRytuk', (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            msg.reply("Giphy serch for: " + args[1], {
                file: info.data.images.original.url,
            });
        }
    });
}

exports.info = {
    name: 'giphy',
    usage: 'gihpy "[search query]"',
    description: 'Returns a gif from giphy',
    category: "images"
};