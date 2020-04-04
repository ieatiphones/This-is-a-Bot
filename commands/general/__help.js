const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    var page;
    var helpable = [];

    if (args[1] && parseInt(args[1]) >= 1) {
        page = parseInt(args[1]) - 1;
    } else if (args[1] == "categories") {
        var validCategories = [];
        var catfeilds = [];
        bot.generalCommands.forEach(command => {
            if (!validCategories.includes(command.info.category) && command.info.category != null) {
                validCategories.push(command.info.category)
                catfeilds.push({
                    name: "" + command.info.category,
                    value: "``" + config.prefix + "help \"" + command.info.category + "\" [page number]``"
                })
            }
        });
        bot.ownerCommands.forEach(command => {
            if (!validCategories.includes(command.info.category) && command.info.category != null) {
                validCategories.push(command.info.category)
                catfeilds.push({
                    name: "" + command.info.category,
                    value: "``" + config.prefix + "help \"" + command.info.category + "\" [page number]``"
                })
            }
        });
        msg.channel.send({
            embed: {
                color: 6697881,
                author: {
                    name: "Help"
                },
                fields: catfeilds,
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: bot.user.tag + " | Category Help"
                }
            }
        });
        return;
    } else if (args[1] == undefined) {
        page = 0;
    } else {
        if (args[2] && parseInt(args[2]) >= 1) {
            var tempVar = args[1];
            args[1] = args[2];
            args[2] = tempVar;
            page = parseInt(args[1]) - 1;
        } else {
            var tempVar = args[1];
            args[2] = '0';
            args[1] = args[2];
            args[2] = tempVar;
            page = 0;
        }
    }

    if (args[2]) {
        bot.generalCommands.forEach(command => {
            if (command.info.category == null) return;
            if (command.info.category == args[2])
                helpable.push(command)
        });
        bot.ownerCommands.forEach(command => {
            if (command.info.category == null) return;
            if (command.info.category == args[2])
                helpable.push(command)
        });
    } else {
        bot.generalCommands.forEach(command => {
            if (command.info.category == null) return;
            helpable.push(command)
        });
        bot.ownerCommands.forEach(command => {
            if (command.info.category == null) return;
            helpable.push(command)
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
                name: "" + helpable[i + 5 * page].info.name,
                value: "" + helpable[i + 5 * page].info.description + "\n``" + config.prefix + helpable[i + 5 * page].info.usage + "``"
            });
            cmdsOnPage++;
        }
    }

    if (page == 68) {
        cmdfeilds.push({
            name: "Nice.",
	        value: "Nice."
	    });
    }

    msg.channel.send({
        embed: {
            color: 6697881,
            author: {
                name: "Help"
            },
            fields: cmdfeilds,
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.tag + " | Page " + (page + 1) + "/" + Math.ceil(helpable.length / 5)
            }
        }
    });
}

exports.info = {
    name: 'help',
    usage: 'help [page number] "{category}"\n' + config.prefix + 'help "[category]" {page number}',
    description: 'What do you think you are currently using?',
    category: "general"
};
