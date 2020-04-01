var tiabag = {
    player: {
        x: 0,
        y: 0,
        u: false,
        d: false,
        l: false,
        r: false,
        size: 40
    },
    block: {
        size: 100,
        cx: 0,
        cy: 0,
        red: 255,
        green: 0,
        blue: 0
    },
    game: {
        time: 5000,
        level: 0,
        speed: 5
    },
    fonts: {
        gravity_reg: null,
        gravity_lig: null,
        gravity_uli: null
    },
    uiVals: {
        titleSize: 1000
    },
    inTitle: true,
    tstrans: false,
    start: false,
    stsec: 3000,
    sgtrans: false,
    inGame: false,
    gsctrans: false,
    score: false,
    scttrans: false,
    movetrans: false
}

var setup = () => {
    createCanvas(window.innerWidth, window.innerHeight);
    width = window.innerWidth;
    height = window.innerHeight;

    tiabag.fonts.gravity_reg = loadFont('./assets/Gravity-Regular.otf');
    tiabag.fonts.gravity_lig = loadFont('./assets/Gravity-Light.otf');
    tiabag.fonts.gravity_uli = loadFont('./assets/Gravity-UltraLight.otf');
    
    noStroke();
    fill(255);
    textFont(tiabag.fonts.gravity_lig);
    textAlign(CENTER, CENTER);
    textSize(tiabag.uiVals.titleSize);
    while (textWidth("THIS IS A BOT'S AWESOME GAME") > width) {
        tiabag.uiVals.titleSize--;
        textSize(tiabag.uiVals.titleSize);
    }
}

var draw = () => {
    background(0);
    translate(width/2, height/2);

    fill(255);
    rect(tiabag.player.x - tiabag.player.size / 2, tiabag.player.y - tiabag.player.size / 2, tiabag.player.size, tiabag.player.size);

    noStroke();
    fill(255);
    textFont(tiabag.fonts.gravity_lig);
    textAlign(CENTER, TOP);
    textSize(tiabag.uiVals.titleSize);
    while (textWidth("THIS IS A BOT'S AWESOME GAME") > width) {
        tiabag.uiVals.titleSize--;
        textSize(tiabag.uiVals.titleSize);
    }
    textSize(tiabag.uiVals.titleSize);
    text("THIS IS A BOT'S AWESOME GAME", 0, -height/2);

    if (tiabag.player.u) tiabag.player.y -= tiabag.game.speed;
    if (tiabag.player.d) tiabag.player.y += tiabag.game.speed;
    if (tiabag.player.l) tiabag.player.x -= tiabag.game.speed;
    if (tiabag.player.r) tiabag.player.x += tiabag.game.speed;
}

var keyPressed = () => {
    if (keyCode === UP_ARROW) tiabag.player.u = true;
    if (keyCode === DOWN_ARROW) tiabag.player.d = true;
    if (keyCode === LEFT_ARROW) tiabag.player.l = true;
    if (keyCode === RIGHT_ARROW) tiabag.player.r = true;
}

var keyReleased = () => {
    if (keyCode === UP_ARROW) tiabag.player.u = false;
    if (keyCode === DOWN_ARROW) tiabag.player.d = false;
    if (keyCode === LEFT_ARROW) tiabag.player.l = false;
    if (keyCode === RIGHT_ARROW) tiabag.player.r = false;
}