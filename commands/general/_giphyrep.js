const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const request = require("request");

exports.run = function (bot, msg, args) {
    if (!args[1]) return msg.channel.send("You must provide tags to search by.")
    console.log(msg.author.tag + " asked for a picture with serch " + args[1] + " rephrased to hell from Giphy");
    var query = args[1].replace(/ /g, '+');
    request('http://api.giphy.com/v1/gifs/translate?s=' + query + '&api_key=ox196Ej6TcRtsGmP6ICDAXyPVepRytuk&weirdness=10', (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            msg.reply("Giphy translated gif with weirdness of 10: " + args[1], {
                file: info.data.images.original.url,
            });
        }
    });
}

exports.info = {
    name: 'giphyno',
    usage: 'giphyno "[search query]"',
    description: 'Returns a gif from giphy that has been rephrased to hell by giphy',
    category: "images"
};