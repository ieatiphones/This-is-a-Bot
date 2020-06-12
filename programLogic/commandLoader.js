const fs = require('fs');

module.exports = function (bot) {
    fs.readdir("./commands/general", (err, fls) => {
        if (err) console.log(err);

        let commands = fls.filter(file => file.split(".").pop() == "js");

        if (commands.length < 1) return console.error("No general commands found.");

        let sortedCommands = [...commands];
        var spaces = sortedCommands.sort((a, b) => b.length - a.length)[0].length + 5;

        commands.forEach((name, i) => {
            let finalSpaces = " ".repeat(spaces - name.length + 1);
            process.stdout.write(`Loading General Command: ${name} `);
            try {
                let command = require(`../commands/general/${name}`);
                bot.generalCommands.set(name, command);
                console.log('\x1b[32m%s\x1b[0m', finalSpaces + 'OK')
            } catch (e) {
                console.log('\x1b[31m%s\x1b[0m', finalSpaces + 'FAIL')
                console.log(e);
            }
        });
    });
    fs.readdir("./commands/iie", (err, fls) => {
        if (err) console.log(err);

        let commands = fls.filter(file => file.split(".").pop() == "js");

        if (commands.length < 1) return console.error("No general commands found.");

        let sortedCommands = [...commands];
        var spaces = sortedCommands.sort((a, b) => b.length - a.length)[0].length + 5;

        commands.forEach((name, i) => {
            let finalSpaces = " ".repeat(spaces - name.length + 1);
            process.stdout.write(`Loading IIE Command: ${name} `);
            try {
                let command = require(`../commands/iie/${name}`);
                bot.iieCommands.set(name, command);
                console.log('\x1b[32m%s\x1b[0m', finalSpaces + 'OK')
            } catch (e) {
                console.log('\x1b[31m%s\x1b[0m', finalSpaces + 'FAIL')
                console.log(e);
            }
        });
    });
    fs.readdir("./commands/owner", (err, fls) => {
        if (err) console.log(err);

        let commands = fls.filter(file => file.split(".").pop() == "js");

        if (commands.length < 1) return console.error("No owner commands found.");

        let sortedCommands = [...commands];
        var spaces = sortedCommands.sort((a, b) => b.length - a.length)[0].length + 5;

        commands.forEach((name, i) => {
            let finalSpaces = " ".repeat(spaces - name.length + 1);
            process.stdout.write(`Loading Owner Command: ${name} `);
            try {
                let command = require(`../commands/owner/${name}`);
                bot.ownerCommands.set(name, command);
                console.log('\x1b[32m%s\x1b[0m', finalSpaces + 'OK')
            } catch (e) {
                console.log('\x1b[31m%s\x1b[0m', finalSpaces + 'FAIL')
                console.log(e);
            }
        });
    });
}