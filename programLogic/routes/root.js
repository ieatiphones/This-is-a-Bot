const fetch = require('node-fetch');
const btoa = require('btoa');
const { json } = require('body-parser');
const config = new require('../../config.json');
const configPrivate = new require('../../configPrivate.json');

const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) routePromise.catch(err => next(err));
});

const makeSessionid = () => {
    var result = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 24; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const MOTDcommand = (command) => {
    var output = "";
    var args = command.split(',');

    if (args[0] == '1') {
        output = bot.guilds.array().length;
    } else if (args[0] == '2') {
        output = bot.guilds.array()[Math.floor(Math.random() * bot.guilds.array().length)].name;
    } else if (args[0] == '3') {
        output = Math.floor(Math.random() * (parseInt(args[1]) - parseInt(args[2])) + parseInt(args[2]));
    }

    return output;
}


module.exports = function (app, bot, DBI) {
    app.get('/', catchAsync(async (req, res) => {
        var selectedMOTD = config.motds[Math.floor(Math.random() * config.motds.length)];
        var newMOTD = "";
        var command = "";
        var inCommand = false;
    
        for (let i = 0; i < selectedMOTD.length; i++) {
            if (selectedMOTD[i] == undefined) continue;
            if (selectedMOTD[i] == "{") {
                inCommand = true;
            }
            if (inCommand) {
                command += selectedMOTD[i];
            } else {
                newMOTD += selectedMOTD[i];
            }
            if (selectedMOTD[i] == "}") {
                command = command.replace('{', '');
                command = command.replace('}', '');
                newMOTD += MOTDcommand(command);
                inCommand = false;
            }
        }
    
        var selectedMOTD = newMOTD;
    
        if (!req.query.code) {
            res.render(appRoot + '/panel/index', {
                SessionID: null,
                motd: selectedMOTD
            });
            return;
        }
        const code = req.query.code;
        const creds = btoa(`${config.clientid}:${configPrivate.clientsecret}`);
        const authReq = await fetch(`https://discord.com/api/v6/oauth2/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `client_id=${config.clientid}&client_secret=${configPrivate.clientsecret}&grant_type=authorization_code&code=${code}&redirect_uri=http%3A%2F%2Fthisisabot.com%2F&scope=identify%20guilds%20email`
                //body: `client_id=${config.clientid}&client_secret=${configPrivate.clientsecret}&grant_type=authorization_code&code=${code}&redirect_uri=http%3A%2F%2Findev.fizzyapple12.com%2F&scope=identify%20guilds%20email`
            });
        const authJson = await authReq.json();
    
        if (authJson.access_token) {
            const userRes = await fetch(`http://discordapp.com/api/users/@me`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authJson.access_token}`,
                    },
                });
            var finalJson = await userRes.json();
            finalJson.token = {
                token: authJson.access_token,
                sessionid: makeSessionid()
            }
            DBI.webPanelUsers.findOne({ id: finalJson.id }, (err, res) => {
                if (err) return;
                if (res) {
                    DBI.webPanelUsers.updateOne({ id: finalJson.id }, {
                        $set: {
                            token: finalJson.token
                        }
                    })
                } else {
                    DBI.webPanelUsers.insertOne(finalJson);
                }
            });
            res.render(appRoot + '/panel/index', {
                SessionID: finalJson.token.sessionid,
                motd: selectedMOTD
            });
        } else {
            res.render(appRoot + '/panel/index', {
                SessionID: null,
                motd: selectedMOTD
            });
        }
    }));
}