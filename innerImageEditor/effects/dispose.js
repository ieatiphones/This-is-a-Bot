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
    return good;
}

exports.effect = function (args) {
    var method = args[0][0].toUpperCase() + args[0].slice(1);
    image.dispose(method)
}

exports.info = {
    name: 'dispose',
    usage: 'dispose [method (None, Background, Previous)]'
};