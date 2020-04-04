const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    msg.channel.send(config.githubURL);
}

exports.info = {
    name: 'github',
    usage: 'github',
    description: 'Gets the URL for the GitHub repository for the bot.',
    category: "general"
};