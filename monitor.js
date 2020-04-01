var nodemon = require('nodemon');
const { app, BrowserWindow, ipcMain } = require('electron');
let win;
var botNodemon;
var botRunning = false;
var upSince;
var upInterval;

ipcMain.on('start', (event, input) => {
    if (!botRunning) {
        botNodemon = nodemon({ script: 'index.js', stdout: false }).on('start', () => {
            console.log('This is a bot monitor started!');
            win.webContents.send('input', "This is a bot started!\n");
            win.webContents.send('status', "Online");
            botRunning = true;
            upSince = new Date();
        }).on('readable', () => {
            if (botNodemon.stdout) {
                botNodemon.stdout.on('data', (data) => {
                    win.webContents.send('input', data.toString());
                });
            }
            if (botNodemon.stderr) {
                botNodemon.stderr.on('data', (data) => {
                    win.webContents.send('input', data.toString());
                });
            }
        }).on('crash', () => {
            win.webContents.send('input', 'This is a bot crashed!\nRestarting...\n');
            win.webContents.send('status', "Crashed");
            upSince = new Date();

            botNodemon.emit('restart');
        });
    }
});

ipcMain.on('restart', (event, input) => {
    if (botRunning) {
        botNodemon.emit('restart');
        upSince = new Date();
    }
});

ipcMain.on('stop', (event, input) => {
    if (botRunning) {
        botNodemon.emit('quit');
        botNodemon.removeAllListeners();
        botRunning = false;
        win.webContents.send('status', "Offline");
        upSince = null;
    }
});

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.setMenu(null)

    win.setMinimumSize(800, 600);

    win.loadFile('monitor/index.html');

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('input', "Connected to process!\n");

        botNodemon = nodemon({ script: 'index.js', stdout: false }).on('start', () => {
            console.log('This is a bot monitor started!');
            win.webContents.send('input', "This is a bot started!\n");
            win.webContents.send('status', "Online");
            upSince = new Date();
            botRunning = true;
        }).on('readable', () => {
            if (botNodemon.stdout) {
                botNodemon.stdout.on('data', (data) => {
                    win.webContents.send('input', data.toString());
                });
            }
            if (botNodemon.stderr) {
                botNodemon.stderr.on('data', (data) => {
                    win.webContents.send('input', data.toString());
                });
            }
        }).on('crash', () => {
            win.webContents.send('input', 'This is a bot crashed!\nRestarting...\n');
            win.webContents.send('status', "Crashed");
            upSince = new Date();

            botNodemon.emit('restart');
        });

        upInterval = setInterval(() => {
            var now = new Date();
            if (now - upSince == null) win.webContents.send('uptime', 'Unknown');
            else win.webContents.send('uptime', now - upSince);
        }, 1000);
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        clearInterval(upInterval);
        app.quit();
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
})