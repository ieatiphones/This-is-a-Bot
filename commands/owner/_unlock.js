const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music, serverPrefs) {
    msg.channel.send("```diff\n- !!!SERVER LOCKDOWN!!! -\n-     UNLOCKING...     -\n```").then((newMSG) => {
        try {
            var serverConfig = serverPrefs.get("servers").find(server => server.id == args[1]).value();

            if (serverConfig.config.locked) serverPrefs.get("servers").find(server => server.id == args[1]).get("config").set("locked", false).write();
            else {
                throw new Error("Already Unlocked!");
            }

            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n+       UNLOCKED!       +\n```");
        } catch (e) {
            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n-   FAILED TO UNLOCK!   -\n```");
        }
    });
}

exports.info = {
    name: 'unlock',
    usage: 'unlock [server id]',
    description: 'unlocks a server',
    category: "security"
};