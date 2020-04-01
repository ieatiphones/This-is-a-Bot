const Discord = module.require("discord.js");
const config = module.require('../../config.json');

const request = require("request");

exports.run = function (bot, msg, args) {
    if (!args[1]) {
        msg.react(bot.emojis.get('587386664012480522'));
	return;
    }
    var program = args[1];
    var variables = {};
    var labels = {};
    var ce = "";
    var r = true;
    var output = "";
    var success = true;

    var print = (val) => {
        // program output handler
        output += val;
    }

    var error = (exc) => {
        // program error handler
        success = false;
    }

    for (var i = 0; i < program.length; i++) {
        if (program[i] == '$') labels[program[i + 1]] = i + 1;
    }
    
    for (var pc = 0; pc < program.length; pc++) {
        ce += program[pc];
        if (program[pc + 1] == undefined || program[pc + 1] == '(' || program[pc + 1] == '[' || program[pc + 1] == '{' || program[pc + 1] == '$' || program[pc + 1] == '@') r = false;
        
        if (r) continue;
    
        // console.error(variables);
        // console.error(labels);
        // console.error('\t' + ce);
        
        switch (ce[0]) {
            case '(':
                if (variables[ce[1]] == undefined) variables[ce[1]] = 0;
                if (ce[2] >= '0' && ce[2] <= '9' || ce[2] == '-' || ce[2] == '.') {
                    var number = ce.slice(2);
                    variables[ce[1]] += parseFloat(number);
                } else variables[ce[1]] += variables[ce[2]];
            break;
            case '[':
                variables[ce[1]] = -variables[ce[1]];
            break;
            case '{':
                if (ce[1] == '~') print(String.fromCharCode(variables[ce[2]]));
                else print(variables[ce[1]]);
            break;
            case '$':
            break;
            case '@':
                switch (ce[2]) {
                    case undefined:
                        pc = labels[ce[1]];
                    break;
                    case '+':
                        if (variables[ce[3]] > 0) pc = labels[ce[1]];
                    break;
                    case '-':
                        if (variables[ce[3]] < 0) pc = labels[ce[1]];
                    break;
                    case '/':
                        if (variables[ce[3]] == 0) pc = labels[ce[1]];
                    break;
                    default:
                        error(`Unknown token: '${ce[2]}'`);
                    break;
                }
            break;
            default:
                error(`Unknown token: '${ce[0]}'`);
            break;
        }
    
        ce = "";
        r = true;
    }

    if (success) {
        msg.react(bot.emojis.get('587386664104755210'));
	msg.channel.send(output);
    } else msg.react(bot.emojis.get('587386664012480522'));
}

exports.info = {
    name: 'hec',
    usage: 'hec [?]',
    description: '???',
    category: "???"
};
