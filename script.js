const CELL = 50; // taille du tableau

let board = [];
let boardW = 0;
let boardH = 0;
let obstacles = [];
let pieces = [];

let dragged = null;
let dragOrigin = null;
let offset = { x: 0, y: 0 };

const boardSVG = document.getElementById("board");
const piecesSVG = document.getElementById("pieces");

const dragLayer = document.createElement("div");
dragLayer.style.position = "fixed";
dragLayer.style.left = "0";
dragLayer.style.top = "0";
dragLayer.style.width = "0";
dragLayer.style.height = "0";
dragLayer.style.pointerEvents = "none";
dragLayer.style.zIndex = "1000";
document.body.appendChild(dragLayer);

// ---------- UTILS ----------
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = rand(0, i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
const normalizeShape = cells => {
    const minX = Math.min(...cells.map(([x]) => x));
    const minY = Math.min(...cells.map(([, y]) => y));
    return cells
        .map(([x, y]) => [x - minX, y - minY])
        .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
};
const rotateShape = shape => normalizeShape(shape.map(([x, y]) => [-y, x]));
const flipShape = shape => normalizeShape(shape.map(([x, y]) => [-x, y]));

// ---------- GAME ----------
function generateGame(w, h) {
    boardW = w;
    boardH = h;

    obstacles = generateObstacles(w, h);
    board = initBoard(w, h, obstacles);
    pieces = generateSimplePieces(w, h, obstacles);

    drawBoard();
    drawPieces();
}

// ---------- OBSTACLES ----------
function generateObstacles(w, h) {
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const count = Math.floor(w * h * 0.15);

    for (let i = 0; i < count; i++) {
        grid[rand(0, h - 1)][rand(0, w - 1)] = -1;
    }
    return grid;
}

// ---------- BOARD ----------
function initBoard(w, h, obs) {
    return Array.from({ length: h }, (_, y) =>
        Array.from({ length: w }, (_, x) => (obs[y][x] === -1 ? -1 : 0))
    );
}

function drawBoard() {
    boardSVG.innerHTML = "";
    boardSVG.setAttribute("width", boardW * CELL);
    boardSVG.setAttribute("height", boardH * CELL);

    const maxW = window.innerWidth * 0.45;
    const maxH = window.innerHeight * 0.7;
    const scale = Math.min(maxW / (boardW * CELL), maxH / (boardH * CELL), 1);

    boardSVG.style.transform = `scale(${scale})`;
    boardSVG.dataset.scale = scale;

    for (let y = 0; y < boardH; y++) {
        for (let x = 0; x < boardW; x++) {
            const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            r.setAttribute("x", x * CELL);
            r.setAttribute("y", y * CELL);
            r.setAttribute("width", CELL);
            r.setAttribute("height", CELL);
            r.setAttribute("rx", 8);
            r.setAttribute("fill", board[y][x] === -1 ? "#444" : "#eee");
            r.setAttribute("stroke", "#333");
            boardSVG.appendChild(r);
        }
    }

    pieces
        .filter(piece => piece.placed)
        .forEach(piece => {
            const g = createPieceGroup(piece, CELL);
            g.setAttribute("transform", `translate(${piece.boardX * CELL},${piece.boardY * CELL})`);

            g.onpointerdown = e => {
                startDragFromBoard(piece, e);
            };

            g.ondblclick = () => {
                removePieceFromBoard(piece);
                piece.shape = rotateShape(piece.shape);

                if (canPlaceAt(piece, piece.boardX, piece.boardY)) {
                    placePieceOnBoard(piece, piece.boardX, piece.boardY);
                } else {
                    piece.placed = false;
                }

                drawBoard();
                drawPieces();
            };

            boardSVG.appendChild(g);
        });
}

// ---------- PIECES ----------
function generateSimplePieces(w, h, obs) {
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

        let targetSize = rand(3, 5);
        if (freeCells.length <= 5) {
            targetSize = freeCells.length;
        } else if (freeCells.length - targetSize === 1 || freeCells.length - targetSize === 2) {
            targetSize = Math.max(3, targetSize - 2);
        }

        const shape = buildPiece(startX, startY, targetSize);

        generatedPieces.push({
            id,
            shape,
            placed: false,
            boardX: 0,
            boardY: 0,
            color: `hsl(${id * 47}, 70%, 60%)`
        });

        id++;
    }

    return generatedPieces;
}

// ---------- DRAW PIECES ----------
function drawPieces() {
    piecesSVG.innerHTML = "";
    const trayRowHeight = 80;
    const trayColWidth = 110;
    const trayPadding = 20;
    const availableHeight = Math.max(400, boardH * CELL);
    const rowsPerColumn = Math.max(1, Math.floor((availableHeight - trayPadding * 2) / trayRowHeight));
    const loosePieces = pieces.filter(piece => !piece.placed);
    const columnCount = Math.max(1, Math.ceil(loosePieces.length / rowsPerColumn));

    piecesSVG.setAttribute("width", trayPadding * 2 + columnCount * trayColWidth);
    piecesSVG.setAttribute("height", availableHeight);

    loosePieces.forEach((piece, index) => {
            const column = Math.floor(index / rowsPerColumn);
            const row = index % rowsPerColumn;
            const trayX = trayPadding + column * trayColWidth;
            const trayY = trayPadding + row * trayRowHeight;
            const g = createPieceGroup(piece, CELL / 2);
            g.setAttribute("transform", `translate(${trayX},${trayY})`);

            g.onpointerdown = e => {
                startDragFromTray(piece, e, trayX, trayY);
            };

            g.ondblclick = () => {
                piece.shape = rotateShape(piece.shape);
                drawPieces();
            };

            g.oncontextmenu = e => {
                e.preventDefault();
                piece.shape = flipShape(piece.shape);
                drawPieces();
            };

            piecesSVG.appendChild(g);
    });
}

// ---------- SVG HELPERS ----------
function createPieceGroup(piece, unit) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.classList.add("piece");

    piece.shape.forEach(([dx, dy]) => {
        const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        r.setAttribute("x", dx * unit);
        r.setAttribute("y", dy * unit);
        r.setAttribute("width", unit);
        r.setAttribute("height", unit);
        r.setAttribute("rx", Math.max(4, unit * 0.12));
        r.setAttribute("fill", piece.color);
        g.appendChild(r);
    });

    return g;
}

function createDragPreview(piece) {
    dragLayer.innerHTML = "";

    const preview = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    preview.classList.add("drag-preview");
    preview.setAttribute("width", boardW * CELL);
    preview.setAttribute("height", boardH * CELL);
    preview.style.overflow = "visible";

    const g = createPieceGroup(piece, CELL);
    preview.appendChild(g);
    dragLayer.appendChild(preview);

    return g;
}

// ---------- DRAG START ----------
function startDragFromTray(piece, event, trayX, trayY) {
    dragged = {
        piece,
        preview: createDragPreview(piece)
    };

    dragOrigin = { placed: false };

    const trayRect = piecesSVG.getBoundingClientRect();
    offset.x = event.clientX - (trayRect.left + trayX);
    offset.y = event.clientY - (trayRect.top + trayY);

    updateDragPreviewPosition(event.clientX, event.clientY);
}

function startDragFromBoard(piece, event) {
    dragged = {
        piece,
        preview: createDragPreview(piece)
    };

    dragOrigin = {
        placed: true,
        boardX: piece.boardX,
        boardY: piece.boardY
    };

    const boardRect = boardSVG.getBoundingClientRect();
    const scale = parseFloat(boardSVG.dataset.scale || 1);
    offset.x = event.clientX - (boardRect.left + piece.boardX * CELL * scale);
    offset.y = event.clientY - (boardRect.top + piece.boardY * CELL * scale);

    removePieceFromBoard(piece);
    drawBoard();
    drawPieces();
    updateDragPreviewPosition(event.clientX, event.clientY);
}

// ---------- DRAG HELPERS ----------
function updateDragPreviewPosition(clientX, clientY) {
    if (!dragged) return;
    dragged.preview.setAttribute(
        "transform",
        `translate(${clientX - offset.x},${clientY - offset.y})`
    );
}

function isInsideRect(clientX, clientY, rect) {
    return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
    );
}

function removePieceFromBoard(piece) {
    for (let y = 0; y < boardH; y++) {
        for (let x = 0; x < boardW; x++) {
            if (board[y][x] === piece.id) {
                board[y][x] = 0;
            }
        }
    }

    piece.placed = false;
}

// ---------- PLACEMENT ----------
function canPlaceAt(piece, gx, gy) {
    for (const [dx, dy] of piece.shape) {
        const x = gx + dx;
        const y = gy + dy;

        if (x < 0 || x >= boardW || y < 0 || y >= boardH || board[y][x] !== 0) {
            return false;
        }
    }

    return true;
}

function placePieceOnBoard(piece, gx, gy) {
    for (const [dx, dy] of piece.shape) {
        board[gy + dy][gx + dx] = piece.id;
    }

    piece.boardX = gx;
    piece.boardY = gy;
    piece.placed = true;
}

// ---------- DRAG ----------
document.onpointermove = e => {
    if (!dragged) return;
    updateDragPreviewPosition(e.clientX, e.clientY);
};

document.onpointerup = e => {
    if (!dragged) return;
    snapAndPlace(dragged.piece, e.clientX, e.clientY);
};

// ---------- SNAP & PLACE ----------
function snapAndPlace(piece, clientX, clientY) {
    const trayRect = piecesSVG.getBoundingClientRect();
    if (isInsideRect(clientX, clientY, trayRect)) {
        piece.placed = false;
        dragged = null;
        dragOrigin = null;
        dragLayer.innerHTML = "";
        drawBoard();
        drawPieces();
        return;
    }

    const rect = boardSVG.getBoundingClientRect();
    const scale = parseFloat(boardSVG.dataset.scale || 1);

    const localX = (clientX - offset.x - rect.left) / scale;
    const localY = (clientY - offset.y - rect.top) / scale;

    const gx = Math.round(localX / CELL);
    const gy = Math.round(localY / CELL);

    const fits = canPlaceAt(piece, gx, gy);

    if (fits) {
        placePieceOnBoard(piece, gx, gy);
    } else if (dragOrigin?.placed) {
        placePieceOnBoard(piece, dragOrigin.boardX, dragOrigin.boardY);
    } else {
        piece.placed = false;
    }

    dragged = null;
    dragOrigin = null;
    dragLayer.innerHTML = "";

    drawBoard();
    drawPieces();
    checkWin();
}

// ---------- WIN ----------
function checkWin() {
    for (let y = 0; y < boardH; y++) {
        for (let x = 0; x < boardW; x++) {
            if (board[y][x] === 0) return;
        }
    }
    alert("Victoire !");
}

function resetPlacedPieces() {
    board = initBoard(boardW, boardH, obstacles);

    pieces.forEach(piece => {
        piece.placed = false;
        piece.boardX = 0;
        piece.boardY = 0;
    });

    dragged = null;
    dragOrigin = null;
    dragLayer.innerHTML = "";

    drawBoard();
    drawPieces();
}

// ---------- UI ----------
document.getElementById("generate").onclick = () => {
    generateGame(
        +document.getElementById("w").value,
        +document.getElementById("h").value
    );
};

document.getElementById("reset-placed").onclick = () => {
    resetPlacedPieces();
};
