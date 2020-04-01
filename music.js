const Discord = require('discord.js');
const config = new require('./config.json');
const ytdl = require('ytdl-core');

var streamOptions = { seek: 0, volume: 0.25 };

var volume = 1.00;
var ready = false;
var repeat = false;
var shuffle = false;
var musicQueue = [];
var dispatcher

module.exports = {
    init: function () {////
        ready = false;
        //play("https://www.youtube.com/watch?v=caomY5CAjwI");
    },

    destroy: function () {////
        ready = false;
        bot.voiceConnections.first().channel.leave();
        ready = false;
    },

    queue: function (url) {//
        musicQueue.push(url);
        console.log(musicQueue);
        if (ready) {
            console.log("Playing Song");
            play(musicQueue[0]);
        } else {
            console.log("Song Queued");
        }
    },

    skip: function () {////
        dispatcher.end();
    },

    list: function () {
        if (musicQueue[0] != null && musicQueue[0] != undefined) {
            return musicQueue;
        } else {
            return "There is nothing in the queue"
        }
    },

    now: function () {//
        if (musicQueue[0] != null && musicQueue[0] != undefined) {
            return musicQueue[0];
        } else {
            return "There is nothing playing at the moment"
        }
    },

    stop: function () {
        musicQueue = [];
        dispatcher.end();
    },

    join: function (msg) {//
        msg.member.voiceChannel.join().then(connection => {
            global.connect = connection;
            ready = true;
        }).catch(console.log);
    },

    leave: function () {//
        ready = false;
        bot.voiceConnections.first().channel.leave();
        ready = false;
    },

    pause: function () {
        dispatcher.pause();
    },

    resume: function () {
        dispatcher.resume();
    },

    getMembers: function () {////
        return bot.voiceConnections.first().channel.members.size;
    },

    toggleRepeat: function () {//
        repeat = !repeat;
        return repeat;
    },

    toggleShuffle: function () {//
        shuffle = !shuffle;
        return shuffle;
    },

    setVolume: function (vol) {
        volume = vol/100;
        dispatcher.setVolume(volume);
        return volume*100;
    }
};

function play(url) {////
    ready = false
    if (url != undefined && url != null) {
        dispatcher = bot.voiceConnections.first().playStream(ytdl(url, { filter: 'audioonly' }));
        dispatcher.setVolume(volume);
        dispatcher.on('end', () => {
            if (!repeat) {
                musicQueue.splice(0, 1);
                ready = true;
                dispatcher.destroy();
                if (musicQueue[0] != undefined) {
                    console.log("Song Change");
                    console.log(musicQueue);
                    if (shuffle) {
                        play(musicQueue[Math.floor(Math.random() * (musicQueue.length - 1))]);
                    } else {
                        play(musicQueue[0]);
                    }
                } else {
                    console.log("Ended Song");
                }
            } else {
                ready = true;
                dispatcher.destroy();
                if (musicQueue[0] != undefined) {
                    console.log("Song Repeat");
                    console.log(musicQueue);
                    play(musicQueue[0]);
                } else {
                    console.log("Ended Song");
                }
            }
        });
    }
}
// ?play www.youtube.com/watch?v=EzKImzjwGyM
// ?play www.youtube.com/watch?v=DpvPnHvuXWg