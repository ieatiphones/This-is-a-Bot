const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const request = require("request");

exports.run = function (bot, msg, args) {
    if (args[1]) {
        console.log(msg.author.tag + " asked the magic eight ball " + args[1]);
        request('https://8ball.delegator.com/magic/JSON/' + args[1], (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                msg.reply(info.magic.answer);
            }
        });
    } else {
        msg.reply("the Magic Eight Ball would like a question");
    }
}

exports.info = {
    name: '8ball',
    usage: '8ball "[question]"',
    description: 'Asks the Magic 8 Ball a question.',
    category: "general"
};