const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args, stat, music, serverPrefs) {
    setTimeout(() => {
        newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n-      LOCKING....      -\n```");

        try {
            serverPrefs.updateOne({ id: msg.guild.id }, {
                $set: {
                    config: {
                        locked: true
                    }
                }
            });

            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n-        LOCKED!        -\n```");
        } catch (e) {
            newMSG.edit("```diff\n- !!!SERVER LOCKDOWN!!! -\n-    FAILED TO LOCK!    -\n```");
        }
    }, 5000);
}

exports.info = {
    name: 'lockdown',
    usage: 'lockdown',
    description: 'Locks the server',
    category: "security"
};