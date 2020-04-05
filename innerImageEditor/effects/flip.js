const Discord = module.require("discord.js");
const config = module.require('../../config.json');
const fs = require('fs');
var im = require('gm').subClass({imageMagick: true});
var image;

/// DO NOT MODIFY
exports.apply = async function (path, args, callback) {
    try {
        image = im(path);
        if (!exports.validate(args)) throw(new Error(`Improper usage, please refer to \`\`${config.iieprefix}effecthelp ${exports.info.name}\`\``));
        exports.effect(args);
        image.write(path, e => {
            if (!e) callback(null);
            else callback(e);
        });
    } catch (e) { callback(e) }
}
/// DO NOT MODIFY

exports.validate = function (args) {
    var good = true;
    if (typeof args[0] != "string") good = false;
    if (typeof args[1] != "string") good = false;
    return good;
}

exports.effect = function (args) {
    if (args[0] == "true") image.flop()
    if (args[1] == "true") image.flip()
}

exports.info = {
    name: 'flip',
    usage: 'flip [horizontal] [vertical]'
};