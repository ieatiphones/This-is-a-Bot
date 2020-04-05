const Discord = module.require("discord.js");
const config = module.require('../../config.json');
var fs = require('fs');

exports.run = function (bot, msg, args) {
    var path = "";
    var lineS = null;
    var lineE = null;

    if (args[1]) {
        path = `${appRoot}/${args[1]}`;
        path = path.replace(/\\/g, "/");
    } else {
        msg.reply("You must specify a file to read.")
        return;
    }

    if (path.includes("configPrivate")) {
        msg.reply("configPrivate.json contains sensitive data and cannot be read.")
        return;
    }

    if (path.includes("/.") || path.includes("/..") || path.includes("~")) {
        msg.reply("Cannot use relative symbols for security reasons.");
        return;
    }

    var data;
    try {
        data = fs.readFileSync(path, 'utf8')
    } catch (e) {
        msg.reply(`Could not find file: \`\`${path}\`\``)
        return;
    }
    var lines = data.split("\n");
    var code = "";

    if (!isNaN(args[2]) && !isNaN(args[3])) {
        lineS = parseInt(args[2]);
        lineE = parseInt(args[3]);

        if (lineS - 1 > lines.length || lineE > lines.length) {
            msg.reply('Start line and end line must be less than the file length');
            return;
        }
    
        if (lineS - 1 > lineE) {
            msg.reply('Start line must be less than the end line');
            return;
        }
    }

    if (!isNaN(args[2]) && !isNaN(args[3])) {
        msg.channel.send(`Reading: \`\`${path}\`\` from line ${lineS} to line ${lineE}`);
        for (var i = lineS - 1; i < lineE; i++) {
            if (i >= lines.length) continue;
            code += lines[i] + "\n";
        }
    } else {
        msg.channel.send(`Reading: \`\`${path}\`\``);
        lines.forEach(line => {
            code += line + "\n";
        });
    }
    msg.channel.sendCode('js', code, { split: true });
}

exports.info = {
    name: 'code',
    usage: 'code "[path relative to the bot\'s root directory]" {start} {end}',
    description: 'Reads the code from a file of a bot.',
    category: "debugging"
};
