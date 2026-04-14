import { state } from "./data.js";

// Retourne true si une case est non posable.
// Une case est bloquee si elle est hors grille, obstaclee ou deja occupee.
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

// Teste si une piece complete peut etre posee a l'origine (gx, gy).
// Toutes les cases de la forme doivent etre valides.
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

// Ecrit la piece dans la grille logique et met a jour ses metadonnees.
export function placePieceOnBoard(piece, gx, gy) {
    for (const [dx, dy] of piece.shape) {
        state.board[gy + dy][gx + dx] = piece.id;
    }

    piece.boardX = gx;
    piece.boardY = gy;
    piece.placed = true;
}
