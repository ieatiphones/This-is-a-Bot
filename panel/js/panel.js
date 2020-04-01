var transformed = false;
var sessionID;
var servers;
var editing;

var transform = () => {
    if (!transformed) {
        if (sessionID && sessionID != null) {
            document.getElementsByClassName("servers-div")[0].innerHTML = '<p class="no-servers-text">Loading Servers...</p>';
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "http://thisisabot.com/userdata/servers", true);
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
        document.getElementsByClassName("info-div")[0].className = "info-div info-div-t";

        setTimeout(() => {
            document.getElementsByClassName("join-button")[0].style.display = "none";
            document.getElementsByClassName("panel-button")[0].style.display = "none";
            document.getElementsByClassName("info-div")[0].style.display = "none";
            document.getElementsByClassName("server-editor")[0].style.display = "block";

            //Transform to full web panel
            document.getElementsByClassName("servers-div")[0].style.display = "block";
            document.getElementsByClassName("servers-div")[0].className = "servers-div servers-div-t";
            document.getElementsByClassName("user-button")[0].className = "user-button user-button-t";

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
            document.getElementsByClassName("info-div")[0].className = "info-div info-div-ut";

            setTimeout(() => {
                transformed = false;
            }, 750);
        }, 750);
    }
}

var openEditor = (index) => {
    var dontNeedShift = $(".server-box").get(index).className == "server-box shifted";
    closeEditor();
    if (!dontNeedShift) {
        $(".server-box").get(index).className = "server-box shifted";
        $(".server-box").eq(index).animate({left: "30%"}, 250, "linear");
        editing = servers[index];
    }
}

var closeEditor = () => {
    if ($(".shifted").length != 0) {
        editing = null;
        for (var i = 0; i < $(".server-box").length; i++) {
            $(".server-box").eq(i).animate({left: "0%"}, 250, "linear");
            $(".server-box").get(i).className = "server-box server-box-hover";
        }
    }
}

window.onload = () => {
    motdRender();
    sessionID = localStorage.getItem("SessionID");

    if (sessionID && sessionID != null) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://thisisabot.com/userdata", true);
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
    } else {
        document.getElementsByClassName("user-button")[0].onclick = () => {
            window.location.href = 'https://discordapp.com/api/oauth2/authorize?client_id=460891988191870976&redirect_uri=http%3A%2F%2Fthisisabot.com%2F&response_type=code&scope=identify%20guilds%20email'
        }
    }
}
