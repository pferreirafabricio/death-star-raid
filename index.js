import GAME_STATE from "./constants/gameStates.js";
import GAME_SETTINGS from "./constants/gameSettings.js";

import player from "./components/player.js";
import obstacle from "./components/obstacle.js";
import scenario from "./components/scenario.js";
import bullet from "./components/bullet.js";

import {
    drawRectangle,
    init as initUtils,
} from "./utils/index.js";
import enemy from "./components/enemy.js";

/** Starts the game only when the DOM is fully loaded */
document.addEventListener("DOMContentLoaded", wakeup);

/** @type {CanvasRenderingContext2D} */
let canvasContext = null;

function wakeup() {
    configureCanvas();
    getScore();

    initUtils(canvasContext);

    drawSky();
    scenario.createBasicElements();

    start();
}

function start() {
    canvasContext.restore();

    // drawElements();
    player.update();

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {
        // scenario.create();
        // scenario.draw();
        // scenario.update();
    }

    // enemy.create();
    // enemy.draw();
    // enemy.update();

    bullet.draw();
    bullet.update();

    canvasContext.save();

    window.requestAnimationFrame(start);
}

/**
 * Set canvas attributes and append it to the body of the document
 */
function configureCanvas() {
    const canvas = document.createElement("canvas")
    canvas.width = GAME_SETTINGS.BASE_WIDTH;
    canvas.height = GAME_SETTINGS.BASE_HEIGHT;
    // canvas.style.border = "1px solid #000";

    canvasContext = canvas.getContext("2d");
    // New shapes are drawn behind the existing canvas content
    // OBS: default is "source-over"
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // canvasContext.globalCompositeOperation = "destination-over";

    document.body.appendChild(canvas);
    document.addEventListener("mousedown", handleGameState);
    document.addEventListener("keydown", (event) => {
        if (event.key === " " || event.code === 'Space') {
            bullet.create();
        }
    });
}

/**
 * Verify if the user has a saved score, if yes, set it to the current record variable
 */
function getScore() {
    let savedRecord = localStorage.getItem("record");

    if (!savedRecord) savedRecord = 0;

    GAME_SETTINGS.RECORD = savedRecord;
}

/**
 * Handle the possibles games states
 */
function handleGameState() {
    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAY) GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAYING;

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {}

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.LOST) {
        player.reset();
        obstacle.clear();
        GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAY;
    }
}

/**
 * Draw all the necessary elements for the game
 * 
 * New shapes are drawn behind the existing canvas content
 * because of the globalCompositeOperation property
 */
function drawElements() {
    player.draw();
}

function drawSky() {
    // Sky
    drawRectangle(0, 0, GAME_SETTINGS.BASE_WIDTH, GAME_SETTINGS.BASE_HEIGHT, "#53d6ed");
}