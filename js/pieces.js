import { normalizeShape, rand, shuffle } from "./utils.js";

// Découpe les cases libres du plateau en grosses pièces connectées.
export function generateSimplePieces(w, h, obs, pieceMin = 3, pieceMax = 5) {
    const used = obs.map(row => row.map(value => value === -1));
    const generatedPieces = [];
    let id = 1;

    const inBounds = (x, y) => x >= 0 && x < w && y >= 0 && y < h;
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    function getFreeCells() {
        const cells = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (!used[y][x]) {
                    cells.push([x, y]);
                }
            }
        }
        return cells;
    }

    function buildPiece(startX, startY, targetSize) {
        // On étend la pièce à partir d'une case de départ en restant connexe.
        const pieceCells = [[startX, startY]];
        const chosen = new Set([`${startX},${startY}`]);
        let frontier = [[startX, startY]];

        while (pieceCells.length < targetSize && frontier.length > 0) {
            const [baseX, baseY] = frontier[rand(0, frontier.length - 1)];
            const neighbors = shuffle(
                directions
                    .map(([dx, dy]) => [baseX + dx, baseY + dy])
                    .filter(([x, y]) => inBounds(x, y) && !used[y][x] && !chosen.has(`${x},${y}`))
            );

            if (neighbors.length === 0) {
                frontier = frontier.filter(([x, y]) => !(x === baseX && y === baseY));
                continue;
            }

            const [nextX, nextY] = neighbors[0];
            pieceCells.push([nextX, nextY]);
            chosen.add(`${nextX},${nextY}`);
            frontier.push([nextX, nextY]);
        }

        pieceCells.forEach(([x, y]) => {
            used[y][x] = true;
        });

        return normalizeShape(pieceCells);
    }

    while (true) {
        const freeCells = getFreeCells();
        if (freeCells.length === 0) break;

        const [startX, startY] = freeCells[rand(0, freeCells.length - 1)];

        let targetSize = rand(pieceMin, pieceMax);
        // Évite de laisser à la fin 1 ou 2 cases impossibles à transformer en vraie pièce.
        if (freeCells.length <= 5) {
            targetSize = freeCells.length;
        } else if (freeCells.length - targetSize === 1 || freeCells.length - targetSize === 2) {
            targetSize = Math.max(pieceMin, targetSize - 2);
        }

        const shape = buildPiece(startX, startY, targetSize);

        generatedPieces.push({
            id,
            shape,
            placed: false,
            boardX: 0,
            boardY: 0,
            trayIndex: generatedPieces.length,
            color: `hsl(${id * 47}, 70%, 60%)`
        });

        id++;
    }

    return generatedPieces;
}
