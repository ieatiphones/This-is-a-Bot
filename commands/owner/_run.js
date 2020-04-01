const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    try {
        var result = eval(args[1]);
        if (result) msg.channel.send("CODE EXECUTION:\nFNISHED```" + result + "```");
        else msg.channel.send("CODE EXECUTION:\nFINISHED\n[no result]");
    } catch (e) {
        msg.channel.send("CODE EXECUTION:\nERROR```" + e + "```");
    }
}

exports.info = {
    name: 'run',
    usage: 'run [code]',
    description: 'Runs JS code',
    category: null
};
