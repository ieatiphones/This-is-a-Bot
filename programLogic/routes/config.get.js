const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) routePromise.catch(err => next(err));
});

module.exports = function (app, bot, DBI) {
    app.get('/config/get', catchAsync(async (req, res) => {
        if (!req.headers || !req.headers.serverid) {
            res.sendStatus(404);
            return
        }
    
        DBI.serverPrefs.findOne({ "id": req.headers.serverid } , async (err, dres) => {
            if (err) {
                res.sendStatus(404);
                return;
            }
            if (dres) {
                res.set("Content-Type", "application/json");
                res.send(dres);
            } else {
                res.sendStatus(404);
            }
        });
    }));
}