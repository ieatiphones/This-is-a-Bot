const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music, serverPrefs) {
    msg.channel.send("```diff\n- !!!SERVER LOCKDOWN!!! -\n- LOCKING IN  5 SECONDS -\n```").then((newMSG) => {
        setTimeout(() => {
            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n- LOCKING IN  4 SECONDS -\n```");
        }, 1000);
        setTimeout(() => {
            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n- LOCKING IN  3 SECONDS -\n```");
        }, 2000);
        setTimeout(() => {
            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n- LOCKING IN  2 SECONDS -\n```");
        }, 3000);
        setTimeout(() => {
            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n- LOCKING IN  1 SECONDS -\n```");
        }, 4000);
        setTimeout(() => {
            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n-      LOCKING....      -\n```");

            try {
                var serverConfig = serverPrefs.get("servers").find(server => server.id == msg.guild.id).value();

                if (!serverConfig.config.locked) serverPrefs.get("servers").find(server => server.id == msg.guild.id).get("config").set("locked", true).write();
                else {
                    throw new Error("Already Locked!");
                }

                newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n-        LOCKED!        -\n```");
            } catch (e) {
                newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n-    FAILED TO LOCK!    -\n```");
            }
        }, 5000);
    });
}

exports.info = {
    name: 'lockdown',
    usage: 'lockdown',
    description: 'Locks the server',
    category: "security"
};