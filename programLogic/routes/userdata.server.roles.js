const fetch = require('node-fetch');
const configPrivate = new require('../../configPrivate.json');

const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) routePromise.catch(err => next(err));
});

module.exports = function (app, bot, DBI) {
    app.get('/userdata/server/roles', catchAsync(async (req, res) => {
        if (!req.headers || !req.headers.sessionid || !req.headers.serverid) {
            res.sendStatus(404);
            return
        }
    
        DBI.webPanelUsers.findOne({ "token.sessionid": req.headers.sessionid } , async (err, dres) => {
            if (err) {
                res.sendStatus(404);
                return;
            }
            if (dres) {
                const serverRes = await fetch(`http://discordapp.com/api/guilds/${req.headers.serverid}/roles`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bot ${configPrivate.token}`,
                        },
                    });
                var serverResJson = await serverRes.json();
                if (!serverResJson) {
                    res.sendStatus(404);
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(serverResJson);
                }
            } else {
                res.sendStatus(404);
            }
        });
    }));
}