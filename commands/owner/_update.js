const Discord = module.require("discord.js");
const config = module.require('../../config.json');
const childProcess = require("child_process");

exports.run = function (bot, msg, args) {
    childProcess.execSync("git pull", { cwd: appRoot });
    childProcess.execSync("pm2 restart 0", { cwd: appRoot });
}

exports.info = {
    name: 'update',
    usage: 'update',
    description: 'Updates the software for the bot from it\'s GitHub',
    category: "general"
};