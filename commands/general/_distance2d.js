const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const math = require('mathjs');
const parser = math.parser();

exports.run = function (bot, msg, args) {
    console.log(msg.author.tag + " found the distance between " + args[1] + ", " + args[2] + " and " + args[3] + ", " + args[4])
    try {
        var answer = math.distance([parseFloat(args[1]), parseFloat(args[2])], [parseFloat(args[3]), parseFloat(args[4])]);
        if (answer) {
            msg.reply("The distance between points ``" + args[1] + ", " + args[2] + "`` and ``" + args[3] + ", " + args[4] + "`` is ``" + answer + "``");
        } else {
            msg.reply("Hmmm... ``" + args[1] + ", " + args[2] + "`` and/or ``" + args[3] + ", " + args[4] + "`` do not appear to be valid points...");
        }
    } catch (e) {
        msg.reply("Hmmm... ``" + args[1] + ", " + args[2] + "`` and/or ``" + args[3] + ", " + args[4] + "`` do not appear to be valid points...");
    }
}

exports.info = {
    name: 'dist2d',
    usage: 'dist2d [x1] [y1] [x2] [y2]',
    description: 'Calculates the eucledian distance between two points in a 2 dimensional space',
    category: "math"
};