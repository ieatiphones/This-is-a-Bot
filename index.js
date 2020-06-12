const Discord = require('discord.js');
global.bot = new Discord.Client();
const configPrivate = new require('./configPrivate.json');

global.appRoot = __dirname
global.appMain = __filename

const IIE = require('./innerImageEditor/index.js');
try { IIE.init(); } catch (e) { console.log('Could not init IIE'); }

const music = require('./music.js');
try { music.init(); } catch (e) { console.log('Could not init music'); }

const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);

const MongoClient = require('mongodb').MongoClient;
const DBI = {};

bot.generalCommands = new Discord.Collection();
bot.ownerCommands = new Discord.Collection();
bot.iieCommands = new Discord.Collection();
bot.verifications = [];

require('./programLogic/commandLoader')(bot);
require('./programLogic/manual')(bot);
require('./programLogic/webserver')(app, bot, DBI);
require('./programLogic/mongo')(MongoClient, DBI);

bot.on('message', msg => require('./programLogic/events/message')(msg, DBI, music, IIE));

bot.on('messageReactionAdd', (reaction, user) => require('./programLogic/events/messageReactionAdd')(reaction, user));

bot.on('guildMemberAdd', member => require('./programLogic/events/guildMemberAdd')(member, DBI));

bot.on('ready', () => require('./programLogic/events/ready')(bot));

bot.login(configPrivate.token).catch(e => {
    console.log(e);
});

server.listen(80, () => {
    console.log('listening on *:80');
});

process.on('uncaughtException', (e) => {
    console.log(e);
});