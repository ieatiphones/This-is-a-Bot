const message = require("../../programLogic/events/message");

const Discord = module.require("discord.js");
const config = module.require('../../config.json');

// modified from: https://github.com/treker7/brainfuck-interpreter/blob/master/brainfuckInterpreter.js
// I was too lazy to write my own.

const MEM_SIZE = 30000;
const mem_arr = [];
var data_ptr = 0;
var output = "";

var init = function() {
    data_ptr = 0;
    output = "";
    mem_arr.length = MEM_SIZE;
    mem_arr.fill(0);
}

var compile = (bfSourceCode) => {
    var jsSourceCode = '(function(ptr, arr) {';

    const codeLength = bfSourceCode.length;
    for (var i = 0; i < codeLength; i++) {
        const currBfInstr = bfSourceCode.charAt(i);

        switch (currBfInstr) {
            case '>':
                jsSourceCode += '++ptr;';
                break;
            case '<':
                jsSourceCode += '--ptr;';
                break;
            case '+':
                jsSourceCode += 'arr[ptr] += 1;';
                break;
            case '-':
                jsSourceCode += 'arr[ptr] -= 1;';
                break;
            case '.':
                jsSourceCode += 'output += String.fromCharCode(arr[ptr]);';
                break;
            case ',':
                // jsSourceCode += 'arr[ptr] = readline.question().charCodeAt(0);';
                // disable input as this has no way of being done as of now
                break;
            case '[':
                jsSourceCode += 'while(arr[ptr]) {';
                break;
            case ']':
                jsSourceCode += '}';
                break;
            default:
        }
    }

    jsSourceCode += '}(data_ptr, mem_arr));'

    return jsSourceCode;
};


exports.run = async function (bot, msg, args) {
    init();
    var jsCode = compile(args[1]);
    var timedOut = true;
    setTimeout(() => {
        if (timedOut) {
            throw new Error("ExecutionError: Script took too long to execute.");
        }
    }, 5000);
    Aexec(jsCode, () => {
        timedOut = false;
        msg.channel.send("```" + output + "```");
    });
}

var Aexec = async (code, callback) => {
    eval(code);
    callback();
}

exports.info = {
    name: 'bf',
    usage: 'bf "[code]"',
    description: 'Runs code throught the Brainfuck interpreter.',
    category: "general"
};