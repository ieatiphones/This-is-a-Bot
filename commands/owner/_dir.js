const Discord = module.require("discord.js");
const config = module.require('../../config.json');
var fs = require('fs');
var path = require('path');

exports.run = function (bot, msg, args) {
    var path = "";
    var lineS = null;
    var lineE = null;

    if (args[1]) {
        path = `${appRoot}/${args[1]}`;
        path = path.replace(/\//g, "/");
    } else {
        path = `${appRoot}`;
        path = path.replace(/\//g, "/");
        return;
    }

    var data;
    try {
        data = fs.readFileSync(path, 'utf8')
    } catch (e) {
        msg.reply(`Could not find path: \`\`${path}\`\``)
        return;
    }


    msg.channel.send(`Files and directories inside of: \`\`${path}\`\``);
    lines.forEach(line => {
        entries += line + "\n";
    });
    msg.channel.send(entries);
}

exports.info = {
    name: 'dir',
    usage: 'dir "[path relative to the bot\'s root directory]"',
    description: 'Lists the directories relative to a directory in the bot.',
    category: "debugging"
};
