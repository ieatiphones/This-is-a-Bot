const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) routePromise.catch(err => next(err));
});

module.exports = function (app, bot, DBI) {
    app.get('/api/stats/stats/:userid', catchAsync(async (req, res) => {
        console.log('Grabbed stats for user: ' + req.params.userid);
        DBI.stat.findOne({ id: req.params.userid }, (err, dres) => {
            if (err) return;
            if (dres) {
                res.set("Content-Type", "application/json");
                res.send(dres);
            } else {
                res.sendStatus(404);
            }
        });
    }));
}