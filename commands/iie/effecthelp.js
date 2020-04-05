const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (callback, bot, msg, args, IIE) {
    var page = 0;
    var helpable = [];
    
    if (args[1] && !Number.isNaN(parseInt(args[1]))) {
        page = parseInt(args[1]) - 1;
        IIE.effects.forEach(effect => {
            helpable.push(effect);
        });
    } else if (args[1] && Number.isNaN(parseInt(args[1]))) {
        var effect = IIE.effects.find(effectI => effectI.info.name === args[1]);
        if (!effect) {
            msg.reply(`Could not find the effect named "${args[1]}"`);
            return;
        }
        helpable.push(effect);
    } else {
        IIE.effects.forEach(effect => {
            helpable.push(effect);
        });
    }

    var cmdfeilds = [{
        "name": "Nothing here...",
        "value": "There is nothing to display on this page."
    }];
    var cmdsOnPage = 0;

    for (var i = 0; i < 5; i++) {
        if (helpable[i + 5 * page] != undefined) {
            if (i == 0) cmdfeilds = []
            cmdfeilds.push({
                name: helpable[i + 5 * page].info.name,
                value: `\`\`${config.prefix + helpable[i + 5 * page].info.usage}\`\``
            });
            cmdsOnPage++;
        }
    }

    msg.channel.send({
        embed: {
            color: 6697881,
            author: {
                name: "Effect Help"
            },
            fields: cmdfeilds,
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: `${bot.user.tag} | Page ${(page + 1)}/${Math.ceil(helpable.length / 5)}`
            }
        }
    });
    callback();
}

exports.info = {
    name: '$$effecthelp',
    usage: '$$effecthelp {Page Number}|{Effect Name}',
    description: 'Gets help on one or more effects.',
    category: "image editing"
};