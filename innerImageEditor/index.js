const Discord = module.require("discord.js");
const config = module.require('../config.json');
const fs = require('fs');

exports.effects = new Discord.Collection();

exports.userImages = [];

exports.init = function () {
    fs.readdir(`${appRoot}/innerImageEditor/effects/`, (err, fls) => {
        if (err) console.log(err);
    
        var effectsList = fls.filter(file => file.split(".").pop() == "js");
    
        if (effectsList.length < 1) {
            console.error("No effects found.");
            return;
        }
    
        effectsList.forEach(name => {
            try {
                var effect = require(`${appRoot}/innerImageEditor/effects/${name}`);
                exports.effects.set(name, effect);
                console.log(`Loaded ${effect.info.name} effect`);
            } catch (e) {
                console.log(e);
            }
        })
    })
}

exports.makeImageid = () => {
    var result = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}