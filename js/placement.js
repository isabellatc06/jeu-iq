import { state } from "./data.js";

// Décrit une case interdite: hors plateau, obstacle ou déjà occupée.
export function isBlockedCell(x, y) {
    return (
        x < 0 ||
        x >= state.boardW ||
        y < 0 ||
        y >= state.boardH ||
        state.obstacles[y][x] === -1 ||
        state.board[y][x] !== 0
    );
}

// Vérifie si toute la forme peut être posée à partir d'une origine de grille.
export function canPlaceAt(piece, gx, gy) {
    for (const [dx, dy] of piece.shape) {
        const x = gx + dx;
        const y = gy + dy;

        if (isBlockedCell(x, y)) {
            return false;
        }
    }

    return true;
}

// Écrit la pièce directement dans la grille logique.
export function placePieceOnBoard(piece, gx, gy) {
    for (const [dx, dy] of piece.shape) {
        state.board[gy + dy][gx + dx] = piece.id;
    }

    piece.boardX = gx;
    piece.boardY = gy;
    piece.placed = true;
}
