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

// Point d'entree applicatif.
// On injecte ici tous les handlers dans state.handlers pour:
// - limiter les dependances croisees entre modules
// - conserver un point de branchement unique et lisible
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

// Initialisation globale de l'application.
// 1) active les evenements drag
// 2) remet le timer a zero
// 3) branche les controles UI
initDragHandlers();
resetTimer();
initUI();
