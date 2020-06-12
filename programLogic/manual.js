const readline = require('readline');

module.exports = async function (bot) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        var args = input.split(" ");
        var cmd = args[0].toLowerCase();
    
        if (cmd == "say") {
            var message = "";
            args.forEach((word, index) => {
                if (index > 1)
                    message += word + " ";
            });
    
            bot.channels.get(args[1]).send(message);
            bot.channels.get(args[1]).stopTyping();
        } else if (cmd == "typing") {
            if (args[1] == "start") {
                bot.channels.get(args[2]).startTyping();
            } else if (args[1] == "stop") {
                bot.channels.get(args[2]).stopTyping();
            }
        }
    });
}