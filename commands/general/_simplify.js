const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const math = require('mathjs');
const parser = math.parser();

exports.run = function (bot, msg, args) {
    console.log(msg.author.tag + " simplified: " + args[1])
    try {
        var answer = math.simplify(args[1]);
        if (answer) {
            msg.reply("``" + args[1] + "`` simplifies to ``" + answer + "``");
        } else {
            msg.reply("Hmmm... " + args[1] + " does not appear to be a valid expression...");
        }
    } catch (e) {
        msg.reply("Hmmm... " + args[1] + " does not appear to be a valid expression...");
    }
}

exports.info = {
    name: 'simple',
    usage: 'simple "[expression]"',
    description: 'Simplifies an expression',
    category: "math"
};