import { state } from "./data.js";

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

export function placePieceOnBoard(piece, gx, gy) {
    for (const [dx, dy] of piece.shape) {
        state.board[gy + dy][gx + dx] = piece.id;
    }

    piece.boardX = gx;
    piece.boardY = gy;
    piece.placed = true;
}
