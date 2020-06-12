const config = new require('../../config.json');

module.exports = async function (bot, music) {
    console.log(`Logged in as ${bot.user.tag}!`);
    //music.init();

    changeColor()
    setInterval(changeColor, 120000);
    changeMark();
    setInterval(changeMark, 90000);
}

const changeColor = () => {
    bot.guilds.array().forEach(guild => {
        guild.me.roles.forEach(role => {
            if (role.name.toLowerCase().includes("this is a bot")) role.setColor(6697881).catch(() => { });
        });
    });
}

const changeMark = () => {
    var act = config.marks[Math.floor(Math.random() * config.marks.length)];
    bot.user.setActivity(act.text, { type: act.type })
}