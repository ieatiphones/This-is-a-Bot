const Discord = module.require("discord.js");
const config = module.require('../../config.json');
var fs = require('fs');
var path = require('path');

exports.run = function (bot, msg, args) {
    var path = "";

    if (args[1]) {
        path = `${appRoot}/${args[1]}`;
        path = path.replace(/\//g, "/");
    } else {
        path = `${appRoot}`;
        path = path.replace(/\//g, "/");
    }

    if (path.includes("/.") || path.includes("/..") || path.includes("~")) {
        msg.reply("Cannot use relative symbols for security reasons.");
        return;
    }

    var data;
    try {
        data = fs.readdirSync(path, { encoding: 'utf8', withFileTypes: true });
    } catch (e) {
        msg.reply(`Could not find path: \`\`${path}\`\``)
        return;
    }

    var list = ``;

    data.forEach((dirent, i) => {
        list += `${dirent.name}${(dirent.isFile()) ? "" : "/"}\n`
    });

    msg.channel.send(`Files and directories inside of: \`\`${path}\`\`\n\`\`\`${list}\`\`\``);
}

exports.info = {
    name: 'dir',
    usage: 'dir "[path relative to the bot\'s root directory]"',
    description: 'Lists the directories relative to a directory in the bot.',
    category: "debugging"
};
