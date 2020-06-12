const config = new require('../../config.json');

const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) routePromise.catch(err => next(err));
});

module.exports = function (app, bot, DBI) {
    app.post('/config/set', catchAsync(async (req, res) => {
        if (!req.headers || !req.headers.serverid || !req.body) {
            res.sendStatus(404);
            return
        }
        if (!req.headers || !req.headers.sessionid) {
            res.sendStatus(401);
            return
        }
    
        DBI.serverPrefs.findOne({ "id": req.headers.serverid } , async (err, dres) => {
            if (err || !dres) {
                res.sendStatus(404);
                return;
            }
    
            DBI.webPanelUsers.findOne({ "token.sessionid": req.headers.sessionid }, async (err, wres) => {
                if (err) {
                    res.sendStatus(404);
                    return;
                }
                if (wres) {
                    if (bot.guilds.get(req.headers.serverid).ownerID == wres.id || wres.id == config.ownerID) {
                        DBI.serverPrefs.replaceOne({ "id": req.headers.serverid }, req.body);
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(401);
                    }
                } else {
                    res.sendStatus(404);
                }
            });
        });
    }));
}