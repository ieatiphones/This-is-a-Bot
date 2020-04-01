const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const request = require("request");

exports.run = function (bot, msg, args) {
    console.log(msg.author.tag + " asked for a picture with id " + args[1] + " from Giphy");
    var query = args[1];
    request('http://api.giphy.com/v1/gifs/' + query + '?api_key=ox196Ej6TcRtsGmP6ICDAXyPVepRytuk', (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            msg.reply("Giphy gif with id: " + args[1], {
                file: info.data.images.original.url,
            });
        } else if (!error && response.statusCode == 404) {
            msg.reply("404 not found. Please check your Giphy ID and try again");
        }
    });
}

exports.info = {
    name: 'giphyid',
    usage: 'gihpyid "[id]"',
    description: 'Returns a gif with specified id from giphy',
    category: "images"
};