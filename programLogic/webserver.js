const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');

module.exports = function (app, bot, DBI) {
    app.use(bodyParser.json());

    app.set('view engine', 'ejs');

    app.use("/assets/", express.static('panel/assets/'));
    app.use("/js/", express.static('panel/js/'));
    app.use("/css/", express.static('panel/css/'));

    fs.readdir("./programLogic/routes", (err, fls) => {
        if (err) console.log(err);

        let commands = fls.filter(file => file.split(".").pop() == "js");

        if (commands.length < 1) return console.error("No owner routes found.");

        commands.forEach((name, i) => {
            try {
                require(`./routes/${name}`)(app, bot, DBI);
                console.log(`Loaded Route: ${name}`)
            } catch (e) {
                console.log(`Failed Loading Route: ${name}`)
                console.log(e);
            }
        });
    });
}