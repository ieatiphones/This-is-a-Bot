var sessionID;
var servers;
var editing;

var currentConfig = {};
var currentServerConfig = {};
var currentConfigReady = false;

var app;

var openEditor = (index) => {
    closeEditor();

    app.selectedConfig = true;

    editing = servers[index];
    currentConfig = {};
    currentConfigReady = false;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/config/get`, true);
    xhttp.setRequestHeader("serverid", editing.id);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var jsonRes = JSON.parse(xhttp.responseText);
                currentServerConfig = jsonRes;
                currentConfig = jsonRes.config;
                currentConfigReady = true;
                app.editingConfig = true;
                renderConfig();
            }
        }
    }
    xhttp.send();
}

var closeEditor = () => {
    currentConfig = {};
    currentServerConfig = {};
    currentConfigReady = false;
    editing = null;
    app.editingConfig = false;
}

var renderConfig = () => {
    app.configLoading = true;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/userdata/server/roles`, true);
    xhttp.setRequestHeader("sessionid", sessionID);
    xhttp.setRequestHeader("serverid", currentServerConfig.id);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var roles = JSON.parse(xhttp.responseText);

                xhttp = new XMLHttpRequest();
                xhttp.open("GET", `/userdata/server/channels`, true);
                xhttp.setRequestHeader("sessionid", sessionID);
                xhttp.setRequestHeader("serverid", currentServerConfig.id);
                xhttp.onreadystatechange = () => {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            var channels = JSON.parse(xhttp.responseText);

                            var textChannels = [];
                            channels.forEach(channel => {
                                if (channel.type == 0) textChannels.push(channel);
                            });

                            app.roles = roles;
                            app.textChannels = textChannels;

                            var finalRoles = "";
                            roles.forEach(role => {
                                finalRoles += `<option value="${role.id}">${role.name}</option>`;
                            });
                            document.getElementById("modroles").innerHTML = finalRoles;
                            
                            var finalTextChannels = "";
                            channels.forEach(channel => {
                                if (channel.type == 0) finalTextChannels += `<option value="${channel.id}">${channel.name}</option>`;
                            });
                            document.getElementById("welcomechannel").innerHTML = finalTextChannels;
                            document.getElementById("nsfwchannel").innerHTML = finalTextChannels;
                            document.getElementById("verifychannel").innerHTML = finalTextChannels;

                            document.getElementById('modrolesset').checked = currentConfig.moderatorRoles.set;
                            $('#modroles').multiSelect("refresh");
                            $('#modroles').multiSelect("select", currentConfig.moderatorRoles.ids);
                            document.getElementById('ms-modroles').onclick = () => {currentConfig.moderatorRoles.ids = $('#modroles').val(); updateCFG() }
                            
                            document.getElementById('verifyset').checked = currentConfig.verificationChannel.set;
                            document.getElementById('beginrole').value = currentConfig.verificationChannel.roleid;
                            document.getElementById('endrole').value = currentConfig.verificationChannel.finalroleid;
                            document.getElementById('verifychannel').value = currentConfig.verificationChannel.channelid;

                            document.getElementById('welcomeallow').checked = currentConfig.welcomeChannel.set;
                            document.getElementById('welcomechannel').value = currentConfig.welcomeChannel.id;

                            document.getElementById('nsfwallow').checked = currentConfig.nsfw.allow;
                            document.getElementById('nsfwchannelset').checked = currentConfig.nsfw.setChannel;
                            document.getElementById('nsfwchannel').value = currentConfig.nsfw.channelid;

                            document.getElementById('lock').checked = currentConfig.locked;

                            document.getElementById('pointnameset').value = currentConfig.pointName;
                            
                            app.configLoading = false;
                        }
                    }
                }
                xhttp.send();
            }
        }
    }
    xhttp.send();
}

var updateCFG = () => {
    currentServerConfig.config = currentConfig;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${window.location.href}config/set`, true);
    xhttp.setRequestHeader("sessionid", sessionID);
    xhttp.setRequestHeader("serverid", currentServerConfig.id);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var mongosafe = currentServerConfig;
    delete mongosafe._id;
    xhttp.send(JSON.stringify(mongosafe));
}

window.onload = () => {
    app = new Vue({
        el: '#vueapp',
        data: {
            loggedIn: false,
            loadingServers: true,
            noServers: false,
            servers: [],
            configLoading: true,
            editingConfig: false,
            selectedConfig: false,
            roles: [],
            textChannels: []
        }
    })

    //$("modroles").multiSelect();
    motdRender();
    sessionID = localStorage.getItem("SessionID");

    if (sessionID && sessionID != "null") {
        try {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", `/userdata`, true);
            xhttp.setRequestHeader("sessionid", sessionID);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        var jsonRes = JSON.parse(xhttp.responseText);
                        app.loggedIn = true;
                        loadServers();
                    } else {
                        logout(false);
                    }
                }
            }
            xhttp.send();
        } catch (e) {
            logout(false);
        }
    } else {
        logout(false);
    }
}

var loadServers = () => {
    app.loadingServers = true;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/userdata/servers`, true);
    xhttp.setRequestHeader("sessionid", sessionID);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var jsonRes = JSON.parse(xhttp.responseText);
                if (jsonRes.length == 0) {
                    app.noServers = true;
                    return;
                }
                servers = jsonRes;
                app.servers = servers;
                app.loadingServers = false;
            } else {
                localStorage.setItem("SessionID", null);
            }
        }
    }
    xhttp.send();
}

var logout = (reload) => {
    localStorage.setItem("SessionID", null);
    app.loggedIn = false;
    if (reload) window.location.reload();
}