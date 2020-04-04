const Discord = module.require("discord.js");
const config = module.require('../../config.json');
const fs = require('fs');
var im = require('gm').subClass({imageMagick: true});
var image;

/// DO NOT MODIFY
exports.apply = async function (path, args, callback) {
    try {
        image = im(path);
        if (!exports.validate(args)) throw(`Improper usage, please refer to \`\`${config.iieprefix}effecthelp ${exports.info.name}\`\``);
        exports.effect(args);
        image.write(path, e => {
            if (!e) callback(null);
            else callback(e);
        });
    } catch (e) { callback(e) }
}
/// DO NOT MODIFY

exports.validate = function (args) { // make sure you have the correct args
    var good = true;

    return good;
}

exports.effect = function (args) { // apply the effect

}

exports.info = {
    name: 'name',
    usage: 'name (enclose){optional}[require]|or|'
};