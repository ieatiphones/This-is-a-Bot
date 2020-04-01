const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const math = require('mathjs');
const parser = math.parser();

exports.run = function (bot, msg, args) {
    console.log(msg.author.tag + " found the distance between " + args[1] + ", " + args[2] + ", " + args[3] + " and " + args[4] + ", " + args[5] + ", " + args[6])
    try {
        var answer = math.distance([parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3])], [parseFloat(args[4]), parseFloat(args[5]), parseFloat(args[6])]);
        if (answer) {
            msg.reply("The distance between points ``" + args[1] + ", " + args[2] + ", " + args[3] + "`` and ``" + args[4] + ", " + args[5] + ", " + args[6] + "`` is ``" + answer + "``");
        } else {
            msg.reply("Hmmm... ``" + args[1] + ", " + args[2] + ", " + args[3] + "`` and/or ``" + args[4] + ", " + args[5] + ", " + args[6] + "`` do not appear to be valid points...");
        }
    } catch (e) {
        msg.reply("Hmmm... ``" + args[1] + ", " + args[2] + ", " + args[3] + "`` and/or ``" + args[4] + ", " + args[5] + ", " + args[6] + "`` do not appear to be valid points...");
    }
}

exports.info = {
    name: 'dist3d',
    usage: 'dist3d [x1] [y1] [z1] [x2] [y2] [z2]',
    description: 'Calculates the eucledian distance between two points in a 3 dimensional space',
    category: "math"
};