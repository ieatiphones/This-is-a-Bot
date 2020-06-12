const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) routePromise.catch(err => next(err));
});

module.exports = function (app, bot, DBI) {
    app.get('/api/', catchAsync(async (req, res) => {
        console.log('[CONNECTION]');
        console.log('    IP: ' + req.ip);
        console.log('    Port: ' + req.connection.remotePort);
        console.log('    Family: ' + req.connection.remoteFamily);
        console.log('    Method: ' + req.method);
        console.log('    Path: ' + req.path);
    
        res.render(appRoot + '/panel/docsreal', {});
    }));
}