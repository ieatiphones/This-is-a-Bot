const config = new require('../../config.json');

const catchAsync = fn => ((req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) routePromise.catch(err => next(err));
});

module.exports = function (app, bot, DBI) {
    app.get('/api/stats/card/:userid', catchAsync(async (req, res) => {
        console.log('Grabbed stats card for user: ' + req.params.userid);
        DBI.stat.findOne({ id: req.params.userid }, (err, dres) => {
            if (err) return;
            if (dres) {
                var totalXP = dres.xp;
                for (var j = 0; j < dres.level - 1; j++) {
                    totalXP += (dres.level * config.xpCoefficient);
                }
        
                res.set("Content-Type", "application/json");
                res.send({
                    embed: {
                        color: dres.color,
                        title: `\"${dres.quote}\"`,
                        author: {
                            name: dres.username
                        },
                        thumbnail: {
                            url: dres.iconurl
                        },
                        fields: [
                            {
                                name: "Level",
                                value: dres.level
                            },
                            {
                                name: "XP",
                                value: `${dres.xp}/${(dres.level * config.xpCoefficient)}\nTotal: ${totalXP}XP`
                            },
                            {
                                name: "Rank(s)",
                                value: `${dres.rank}\n${dres.rankSP}`
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: bot.user.tag
                        }
                    }
                });
            } else {
                res.sendStatus(404);
            }
        });
    }));
}