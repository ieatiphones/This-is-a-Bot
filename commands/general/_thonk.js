const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, argimage) {
    msg.delete();
    msg.channel.send(":T01::T02::T03::T04::T05::T06::T07::T08:");
    msg.channel.send(":T01::T09::T10::T11::T12::T13::T13::T14:");
    msg.channel.send(":T15::T16::T17::T18::T13::T19::T20::T21::T22:");
    msg.channel.send(":T23::T13::T24::T25::T13::T26::T27::T13::T28:");
    msg.channel.send(":T29::T13::T30::T31::T32::T33::T13::T13::T34:");
    msg.channel.send(":T35::T36::T37::T38::T39::T40::T41::T42::T43:");
    msg.channel.send(":T01::T44::T45::T46::T47::T48::T49::T50:");
    msg.channel.send(":T01::T51::T52::T52::T53::T54::T55::T56:");
    msg.channel.send(":T01::T57::T58::T59::T60:");
}

exports.info = {
    name: 'thonk',
    usage: 'thonk',
    description: 'Puts a big thonk emoji in chat',
    category: "images"
};

/*
:T01::T02::T03::T04::T05::T06::T07::T08:
:T01::T09::T10::T11::T12::T13::T13::T14:
:T15::T16::T17::T18::T13::T19::T20::T21::T22:
:T23::T13::T24::T25::T13::T26::T27::T13::T28:
:T29::T13::T30::T31::T32::T33::T13::T13::T34:
:T35::T36::T37::T38::T39::T40::T41::T42::T43:
:T01::T44::T45::T46::T47::T48::T49::T50:
:T01::T51::T52::T52::T53::T54::T55::T56:
:T01::T57::T58::T59::T60:
 */
