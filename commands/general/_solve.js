const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const math = require('mathjs');
const parser = math.parser();

exports.run = function (bot, msg, args) {
    console.log(msg.author.tag + " solved: " + args[1])
    try {
        var answer = parser.eval(args[1]);
        if (answer) {
            if (typeof answer === 'number') {
                msg.reply("``" + args[1] + "`` = ``" + answer + "``");
            } else {
                msg.reply("expression provided successfully executed");
            }
        } else {
            msg.reply("Hmmm... " + args[1] + " does not appear to be a valid expression...");
        }
    } catch (e) {
        msg.reply("Hmmm... " + args[1] + " does not appear to be a valid expression...");
    }
}

exports.info = {
    name: 'solve',
    usage: 'solve "[math equation]"',
    description: 'Solves a math equation',
    category: "math"
};