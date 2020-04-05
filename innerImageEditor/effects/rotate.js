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
    if (Number.isNaN(parseInt(args[0]))) good = false;
    if (Number.isNaN(parseInt(args[1]))) good = false;
    if (Number.isNaN(parseInt(args[2]))) good = false;
    if (Number.isNaN(parseInt(args[3]))) good = false;
    return good;
}

exports.effect = function (args) {
    image.rotate(`rgb(${parseInt(args[1])},${parseInt(args[2])},${parseInt(args[3])})`, parseInt(args[0]))
}

exports.info = {
    name: 'rotate',
    usage: 'rotate [degrees] [r] [g] [b]'
};