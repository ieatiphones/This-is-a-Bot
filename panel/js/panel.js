var transformed = false;
var sessionID;
var servers;
var editing;

var currentConfig = {};
var currentServerConfig = {};
var currentConfigReady = false;

var transform = (type) => {
    if (!transformed) {
        sessionID = localStorage.getItem("SessionID");
        if (sessionID && sessionID != "null" && type == 1) {
            document.getElementsByClassName("servers-div")[0].innerHTML = '<p class="no-servers-text">Loading Servers...</p>';
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", `${window.location.href}userdata/servers`, true);
            xhttp.setRequestHeader("sessionid", sessionID);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        var jsonRes = JSON.parse(xhttp.responseText);
                        if (jsonRes.length == 0) {
                            document.getElementsByClassName("servers-div")[0].innerHTML = '<p class="no-servers-text">No servers here. You will see servers if you are the owner or have a high enough role.</p>';
                            return;
                        }
                        document.getElementsByClassName("servers-div")[0].innerHTML = "";
                        servers = jsonRes;
                        jsonRes.forEach((server, i) => {
                            var picURL;
                            if (server.icon != null) picURL = `https://cdn.discordapp.com/icons/${server.id}/${server.icon}`;
                            else picURL = "./assets/discord-logo.png"
                            document.getElementsByClassName("servers-div")[0].innerHTML += `<div class="server-box server-box-hover" onclick="openEditor(${i})" style="top: ${i*62}px"><img class="server-box-img" src="${picURL}" alt="Icon"><p class="server-box-text">${server.name}</p></div>`
                        });
                    } else {
                        localStorage.setItem("SessionID", null);
                    }
                }
            }
            xhttp.send();
        } else {
            document.getElementsByClassName("servers-div")[0].innerHTML = '<p class="no-servers-text">You need to log in to view servers!</p>';
        }

        //Transform to blank web panel
        document.getElementsByClassName("top-div")[0].className = "top-div top-div-t";
        document.getElementsByClassName("bot-icon")[0].className = "bot-icon bot-icon-t";
        document.getElementsByClassName("bot-name")[0].className = "bot-name bot-name-t";
        document.getElementsByClassName("bot-description")[0].className = "bot-description bot-description-t";
        document.getElementsByClassName("bottom-div")[0].className = "bottom-div bottom-div-t";
        document.getElementsByClassName("join-button")[0].className = "join-button join-button-t";
        document.getElementsByClassName("panel-button")[0].className = "panel-button panel-button-t";
        document.getElementsByClassName("support-button")[0].className = "support-button support-button-t";
        document.getElementsByClassName("stats-button")[0].className = "stats-button stats-button-t";
        document.getElementsByClassName("info-div")[0].className = "info-div info-div-t";


        setTimeout(() => {
            document.getElementsByClassName("join-button")[0].style.display = "none";
            document.getElementsByClassName("panel-button")[0].style.display = "none";
            document.getElementsByClassName("info-div")[0].style.display = "none";
            switch (type) {
                case 1:
                    //Transform to full web panel
                    document.getElementsByClassName("server-editor")[0].style.display = "block";
                    document.getElementsByClassName("servers-div")[0].style.display = "block";
                    document.getElementsByClassName("servers-div")[0].className = "servers-div servers-div-t";
                    document.getElementsByClassName("user-button")[0].className = "user-button user-button-t";
                    break;
                case 2:

                    break;
            }

            setTimeout(() => {
                transformed = true;
            }, 750);
        }, 750);
    }
}

var untransform = () => {
    if (transformed) {
        if ($(".shifted").length != 0) {
            for (var i = 0; i < $(".server-box").length; i++) {
                $(".server-box").eq(i).animate({left: "0%"}, 250, "linear");
                $(".server-box").get(i).className = "server-box server-box-hover";
            }
        }

        //Transform to blank web panel
        document.getElementsByClassName("servers-div")[0].className = "servers-div servers-div-ut";
        document.getElementsByClassName("user-button")[0].className = "user-button user-button-ut";
        $(".server-editor").animate({opacity: "0"}, 500, "linear");
        
        setTimeout(() => {
            document.getElementsByClassName("join-button")[0].style.display = "block";
            document.getElementsByClassName("panel-button")[0].style.display = "block";
            document.getElementsByClassName("info-div")[0].style.display = "block";
            document.getElementsByClassName("servers-div")[0].style.display = "none";
            document.getElementsByClassName("server-editor")[0].style.display = "none";

            //Transform back to home
            document.getElementsByClassName("top-div")[0].className = "top-div top-div-ut";
            document.getElementsByClassName("bot-icon")[0].className = "bot-icon bot-icon-ut";
            document.getElementsByClassName("bot-name")[0].className = "bot-name bot-name-ut";
            document.getElementsByClassName("bot-description")[0].className = "bot-description bot-description-ut";
            document.getElementsByClassName("bottom-div")[0].className = "bottom-div bottom-div-ut";
            document.getElementsByClassName("join-button")[0].className = "join-button join-button-ut";
            document.getElementsByClassName("panel-button")[0].className = "panel-button panel-button-ut";
            document.getElementsByClassName("support-button")[0].className = "support-button support-button-ut";
            document.getElementsByClassName("stats-button")[0].className = "stats-button stats-button-ut";
            document.getElementsByClassName("info-div")[0].className = "info-div info-div-ut";

            setTimeout(() => {
                transformed = false;
            }, 750);
        }, 750);
    }
}

var openEditor = (index) => {
    editing = servers[index];
    currentConfig = {};
    currentConfigReady = false;

    var dontNeedShift = $(".server-box").get(index).className == "server-box shifted";

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `${window.location.href}config/get`, true);
    xhttp.setRequestHeader("serverid", editing.id);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var jsonRes = JSON.parse(xhttp.responseText);
                currentServerConfig = jsonRes;
                currentConfig = jsonRes.config;
                currentConfigReady = true;
                if (!dontNeedShift) renderConfig();
            }
        }
    }
    xhttp.send()
    closeEditor();
    if (!dontNeedShift) {
        $(".server-box").get(index).className = "server-box shifted";
        $(".server-box").eq(index).animate({left: "30%"}, 250, "linear");
    }
}

var closeEditor = () => {
    currentConfig = {};
    currentServerConfig = {};
    currentConfigReady = false;
    if ($(".shifted").length != 0) {
        editing = null;
        for (var i = 0; i < $(".server-box").length; i++) {
            $(".server-box").eq(i).animate({left: "0%"}, 250, "linear");
            $(".server-box").get(i).className = "server-box server-box-hover";
        }
        $(".server-editor").animate({opacity: "0"}, 500, "linear");
    }
}

var renderConfig = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `${window.location.href}userdata/server/roles`, true);
    xhttp.setRequestHeader("sessionid", sessionID);
    xhttp.setRequestHeader("serverid", currentServerConfig.id);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var roles = JSON.parse(xhttp.responseText);

                xhttp = new XMLHttpRequest();
                xhttp.open("GET", `${window.location.href}userdata/server/channels`, true);
                xhttp.setRequestHeader("sessionid", sessionID);
                xhttp.setRequestHeader("serverid", currentServerConfig.id);
                xhttp.onreadystatechange = () => {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            var channels = JSON.parse(xhttp.responseText);

                            var finalRoles = "";
                            roles.forEach(role => {
                                finalRoles += `<option value="${role.id}">${role.name}</option>`;
                            });
                            document.getElementById("modroles").innerHTML = finalRoles;
                            document.getElementById("beginrole").innerHTML = finalRoles;
                            document.getElementById("endrole").innerHTML = finalRoles;
                            
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
                            $(".server-editor").animate({opacity: "1"}, 500, "linear");
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
    $("modroles").multiSelect();
    motdRender();
    sessionID = localStorage.getItem("SessionID");

    if (sessionID && sessionID != "null") {
        try {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", `${window.location.href}userdata`, true);
            xhttp.setRequestHeader("sessionid", sessionID);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        var jsonRes = JSON.parse(xhttp.responseText);
                        document.getElementsByClassName("user-button")[0].innerHTML = `<img src="https://cdn.discordapp.com/avatars/${jsonRes.id}/${jsonRes.avatar}" alt="${jsonRes.username}" class="user-button-icon">`

                        document.getElementsByClassName("user-button")[0].onclick = () => {
                            localStorage.removeItem("SessionID");
                            window.location.reload();
                        }
                    } else {
                        localStorage.setItem("SessionID", null);
                    }
                }
            }
            xhttp.send();
        } catch (e) {
            uvFail();
        }
    } else {
        uvFail()
    }
}

var uvFail = () => {
    document.getElementsByClassName("user-button")[0].onclick = () => {
        window.location.href = 'https://discordapp.com/api/oauth2/authorize?client_id=460891988191870976&redirect_uri=http%3A%2F%2Fthisisabot.com%2F&response_type=code&scope=identify%20guilds%20email'
        //window.location.href = 'https://discordapp.com/api/oauth2/authorize?client_id=460891988191870976&redirect_uri=http%3A%2F%2Findev.fizzyapple12.com%2F&response_type=code&scope=identify%20guilds%20email'
    }
}