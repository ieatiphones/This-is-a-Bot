const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music, serverPrefs) {
    msg.channel.send("```diff\n- !!!SERVER LOCKDOWN!!! -\n-     UNLOCKING...     -\n```").then((newMSG) => {
        try {
            serverPrefs.updateOne({ id: msg.guild.id }, {
                $set: {
                    config: {
                        locked: false
                    }
                }
            });

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