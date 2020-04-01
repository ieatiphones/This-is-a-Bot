const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const math = require('mathjs');
const parser = math.parser();

exports.run = function (bot, msg, args) {
    console.log(msg.author.tag + " found the intersection between lines " + args[1] + ", " + args[2] + " to " + args[3] + ", " + args[4] + " and " + args[5] + ", " + args[6] + " to " + args[7] + ", " + args[8])
    try {
        var answer = math.intersect([parseFloat(args[1]), parseFloat(args[2])], [parseFloat(args[3]), parseFloat(args[4])], [parseFloat(args[5]), parseFloat(args[6])], [parseFloat(args[7]), parseFloat(args[8])]);
        if (answer) {
            msg.reply("The intersection between lines ``" + args[1] + ", " + args[2] + "`` to ``" + args[3] + ", " + args[4] + "`` and ``" + args[5] + ", " + args[6] + "`` to ``" + args[7] + ", " + args[8] + "`` is at ``" + answer + "``");
        } else {
            msg.reply("Hmmm... ``" + args[1] + ", " + args[2] + "`` to ``" + args[3] + ", " + args[4] + "`` and/or ``" + args[5] + ", " + args[6] + "`` to ``" + args[7] + ", " + args[8] + "`` do not appear to be valid or intersecting lines...");
        }
    } catch (e) {
        msg.reply("Hmmm... ``" + args[1] + ", " + args[2] + "`` to ``" + args[3] + ", " + args[4] + "`` and/or ``" + args[5] + ", " + args[6] + "`` to ``" + args[7] + ", " + args[8] + "`` do not appear to be valid or intersecting lines...");
    }
}

exports.info = {
    name: 'isect2d',
    usage: 'isect2d [line1 x1] [line1 y1] [line1 x2] [line1 y2] [line2 x1] [line2 y1] [line2 x2] [line2 y2]',
    description: 'Calculates the point of intersection of two lines in a 2 dimensional space',
    category: "math"
};