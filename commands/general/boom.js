const Discord = module.require("discord.js");
const config = module.require('../../config.json');

exports.run = function (bot, msg, args) {
    msg.channel.send("```      )\n     (\n    .-`-.\n    :   :\n    :TNT:\n    :___:```").then((message1) => {setTimeout(() => {
        message1.edit("```    \\|/\n   - o -\n    /-`-.\n    :   :\n    :TNT:\n    :___:```").then((message2) => {setTimeout(() => {
            message2.edit("```    .---.\n    : | :\n    :-o-:\n    :_|_:```").then((message3) => {setTimeout(() => {
                message3.edit("```    .---.\n    (\\|/)\n    --0--\n    (/|\\)```").then((message4) => {setTimeout(() => {
                    message4.edit("```   '.\\|/.'\n   (\\   /)\n   - -O- -\n   (/   \\)\n   ,'/|\\'.```").then((message5) => {setTimeout(() => {
                        message5.edit("```'.  \\ | /  ,'\n  `. `.' ,'\n ( .`.|,' .)\n - ~ -0- ~ -\n (```").then((message6) => {setTimeout(() => {
                            message6.edit("```','|'.` )\n  .' .'. '.\n,'  / | \\  '.\n    \\ '  \"\n ` . `.' ,'\n . `` ,'. \"\n   ~ (   ~ -\n'```").then((message7) => {setTimeout(() => {
                                message7.edit("```. ','|` ` .\n  .'  \"  '\n,   ' , '  `\n\n   (  ) (\n    ) ( )\n    (  )\n     ) /\n    ,---.```").then((message8) => {setTimeout(() => {
                                    message8.delete()
                                    msg.delete();
                                }, 500)});
                            }, 500)});
                        }, 500)});
                    }, 500)});
                }, 500)});
            }, 500)});
        }, 500)});
    }, 2000)});
}

exports.info = {
    name: 'boom',
    usage: null,
    description: null,
    category: null
};