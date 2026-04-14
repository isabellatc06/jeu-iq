import { state } from "./data.js";
import { drawBoard } from "./board.js";
import { drawPieces } from "./draw-pieces.js";
import { initDragHandlers } from "./drag.js";
import { rotateDraggedPiece, startDragFromBoard, startDragFromTray } from "./drag-start.js";
import { snapAndPlace } from "./snap-place.js";
import { setGameStartedUI } from "./game.js";
import { getElapsedTimeLabel, resetTimer, startTimer, stopTimer } from "./timer.js";
import { initUI } from "./ui.js";
import { checkWin, returnToStartup } from "./win.js";

state.handlers.drawBoard = drawBoard;
state.handlers.drawPieces = drawPieces;
state.handlers.checkWin = checkWin;
state.handlers.returnToStartup = returnToStartup;
state.handlers.startDragFromTray = startDragFromTray;
state.handlers.startDragFromBoard = startDragFromBoard;
state.handlers.snapAndPlace = snapAndPlace;
state.handlers.rotateDraggedPiece = rotateDraggedPiece;
state.handlers.setGameStartedUI = setGameStartedUI;
state.handlers.resetTimer = resetTimer;
state.handlers.startTimer = startTimer;
state.handlers.stopTimer = stopTimer;
state.handlers.getElapsedTimeLabel = getElapsedTimeLabel;

initDragHandlers();
resetTimer();
initUI();
