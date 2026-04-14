import { CELL, refs, state } from "./data.js";
import { getShapeBounds } from "./utils.js";
import { createPieceGroup } from "./svg-helpers.js";

// Redessine la reserve de pieces a droite.
// Chaque piece est placee dans une "slot card" calculée sur une grille colonnes/lignes.
export function drawPieces() {
    refs.piecesSVG.innerHTML = "";
    const trayRowHeight = 80;
    const trayColWidth = 110;
    const trayPadding = 20;
    const trayInnerWidth = trayColWidth - 20;
    const trayInnerHeight = trayRowHeight - 20;

    // La hauteur de reserve suit la hauteur du plateau pour garder une interface equilibree.
    const preferredHeight = Math.max(280, state.boardH * CELL);
    const rowsPerColumn = Math.max(1, Math.floor((preferredHeight - trayPadding * 2) / trayRowHeight));
    const visibleRows = Math.max(1, Math.min(rowsPerColumn, state.pieces.length));
    const columnCount = Math.max(1, Math.ceil(state.pieces.length / rowsPerColumn));
    const trayWidth = trayPadding + columnCount * trayColWidth - 10;
    const trayHeight = trayPadding + visibleRows * trayRowHeight;

    refs.piecesSVG.setAttribute("width", trayWidth);
    refs.piecesSVG.setAttribute("height", trayHeight);

    state.pieces.forEach(piece => {
        // Position logique de la piece dans la reserve (index -> colonne + ligne).
        const column = Math.floor(piece.trayIndex / rowsPerColumn);
        const row = piece.trayIndex % rowsPerColumn;
        const trayX = trayPadding + column * trayColWidth;
        const trayY = trayPadding + row * trayRowHeight;
        const bounds = getShapeBounds(piece.shape);
        // Chaque piece est reduite pour tenir dans sa slot, tout en gardant sa proportion.
        const unit = Math.min(
            CELL / 2,
            trayInnerWidth / bounds.width,
            trayInnerHeight / bounds.height
        );
        const pieceWidth = bounds.width * unit;
        const pieceHeight = bounds.height * unit;
        const offsetX = trayX + (trayInnerWidth - pieceWidth) / 2;
        const offsetY = trayY + (trayInnerHeight - pieceHeight) / 2;

        const slot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        slot.setAttribute("x", trayX - 10);
        slot.setAttribute("y", trayY - 10);
        slot.setAttribute("width", trayInnerWidth);
        slot.setAttribute("height", trayInnerHeight);
        slot.setAttribute("rx", 14);
        slot.setAttribute("class", "tray-slot");
        refs.piecesSVG.appendChild(slot);

        // Piece deja posee ou actuellement attrapee: cachee dans la reserve.
        if (piece.placed || (state.dragged && state.dragged.piece === piece)) {
            return;
        }

        const g = createPieceGroup(piece, unit);
        g.setAttribute("transform", `translate(${offsetX},${offsetY})`);

        g.onpointerdown = e => {
            // Clic sur piece disponible = debut d'un drag depuis la reserve.
            if (state.dragged) return;
            e.preventDefault();
            e.stopPropagation();
            state.handlers.startDragFromTray(piece, e, trayX, trayY);
        };

        refs.piecesSVG.appendChild(g);
    });
}
