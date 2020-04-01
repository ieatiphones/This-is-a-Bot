const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    if (args[1].toLowerCase() == "bored") {
        // bot.channels.get(config.logsChannel).send(msg.author.tag + " got roatsted by the bot");
        console.log(msg.author.tag + " got roatsted by the bot");
        msg.reply("Hi Bored, i'm a bot!", {
            file: "http://media.giphy.com/media/cF7QqO5DYdft6/giphy.gif",
        });
    } else if (args[1].toLowerCase() == "dad") {
        // bot.channels.get(config.logsChannel).send(msg.author.tag + " roatsted the bot");
        console.log(msg.author.tag + " roatsted the bot");
        msg.reply("I'm Bored");
        setTimeout(function () { msg.channel.send("Wait a second..."); }, 1000);
        setTimeout(function () { msg.channel.send("", { file: "https://media1.tenor.com/images/cbb5332b609d9e1bb484c5dc925a774d/tenor.gif", }); }, 2000);
    } else if (args[1].toLowerCase() == "bot") {
        // bot.channels.get(config.logsChannel).send(msg.author.tag + " tried to challenge the bots' authority");
        console.log(msg.author.tag + " tried to challenge the bots' authority");
        msg.reply("no, i'm the bot around here.");
    }
    run = true;
}

exports.info = {
    name: 'im',
    usage: null,
    description: null,
    category: null
};