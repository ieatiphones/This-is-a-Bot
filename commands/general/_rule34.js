const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const request = module.require("request");

exports.run = async function (bot, msg, args, stat, music, serverPrefs) {
    if (args[1] == undefined) {
        msg.reply("You must provide at least one tag to search by.")
        return;
    }

    var currentServerConfig = await serverPrefs.findOne({ id: msg.guild.id });

    if (currentServerConfig) {
        if(!currentServerConfig.config.nsfw.allow) {
            msg.reply("NSFW is disabled in this server.");
            return;
        }
        if (currentServerConfig.config.nsfw.setChannel && msg.channel.id != currentServerConfig.config.nsfw.channelid) {
            msg.reply(`You must use NSFW commands in <#${currentServerConfig.config.nsfw.channelid}>`);
            return;
        }
    }

    var query = args[1].replace(/ /g, "+");
    console.log(msg.author.tag + " asked for rule34 with tags: " + args[1]);
    request('https://r34-json-api.herokuapp.com/posts?tags=' + query, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var reply = JSON.parse(body);
            if (reply.length == 0) {
                msg.reply("Found no results with tags: " + args[1])
                return;
            }
            var randomNum = Math.floor(Math.random() * reply.length);
            // console.log(randomNum)
            // console.log(reply[randomNum].file_url)
            
            msg.reply("Rule34 image with tags: " + args[1], {
                file: reply[randomNum].file_url,
            });
        }
    });
}

exports.info = {
    name: 'rule34',
    usage: 'rule34 "[tags]"',
    description: 'Grabs an image off of rule34.paheal.net',
    category: "images"
};