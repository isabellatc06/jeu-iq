const CELL = 50;

let board = [];
let boardW = 0;
let boardH = 0;
let obstacles = [];
let pieces = [];

let dragged = null;
let offset = { x: 0, y: 0 };

const boardSVG = document.getElementById("board");
const piecesSVG = document.getElementById("pieces");

// ---------- UTILS ----------
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

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
        Array.from({ length: w }, (_, x) =>
            obs[y][x] === -1 ? -1 : 0
        )
    );
}

function drawBoard() {
    boardSVG.innerHTML = "";
    boardSVG.setAttribute("width", boardW * CELL);
    boardSVG.setAttribute("height", boardH * CELL);

    for (let y = 0; y < boardH; y++) {
        for (let x = 0; x < boardW; x++) {
            const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            r.setAttribute("x", x * CELL);
            r.setAttribute("y", y * CELL);
            r.setAttribute("width", CELL);
            r.setAttribute("height", CELL);
            r.setAttribute("rx", 8);

            if (board[y][x] === -1) r.setAttribute("fill", "#444");
            else if (board[y][x] > 0) {
                const p = pieces.find(p => p.id === board[y][x]);
                r.setAttribute("fill", p ? p.color : "#aaa");
            } else r.setAttribute("fill", "#eee");

            r.setAttribute("stroke", "#333");
            boardSVG.appendChild(r);
        }
    }
}

// ---------- PIECES ----------
function generateSimplePieces(w, h, obs) {
    const used = obs.map(r => r.map(v => v === -1));
    const pieces = [];
    let id = 1;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (!used[y][x]) {
                const shape = [[0, 0]];
                used[y][x] = true;

                if (x + 1 < w && !used[y][x + 1]) {
                    shape.push([1, 0]);
                    used[y][x + 1] = true;
                }
                if (y + 1 < h && !used[y + 1][x]) {
                    shape.push([0, 1]);
                    used[y + 1][x] = true;
                }

                pieces.push({
                    id,
                    shape,
                    x: 20,
                    y: id * 70,
                    placed: false,
                    color: `hsl(${id * 60},70%,60%)`,
                    g: null
                });

                id++;
            }
        }
    }

    return pieces;
}

// ---------- DRAW PIECES ----------
function drawPieces() {
    piecesSVG.innerHTML = "";
    const visiblePieces = pieces.filter(p => !p.placed);
    piecesSVG.setAttribute("width", 220);
    piecesSVG.setAttribute("height", Math.max(visiblePieces.length * 70 + 20, 200));

    visiblePieces.forEach((p, index) => {
        if (!dragged || dragged !== p) {
            p.x = 20;
            p.y = index * 70;
        }

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.classList.add("piece");
        g.setAttribute("transform", `translate(${p.x},${p.y})`);
        p.g = g;

        drawPieceShape(p);

        g.onpointerdown = e => {
            dragged = p;
            offset.x = e.offsetX - p.x;
            offset.y = e.offsetY - p.y;
            g.setPointerCapture(e.pointerId);

            // mettre la pièce au-dessus pour drag visible
            piecesSVG.appendChild(g);
        };

        g.ondblclick = () => {
            // rotation seulement de cette pièce
            p.shape = p.shape.map(([x, y]) => [-y, x]);
            drawPieceShape(p);
        };

        piecesSVG.appendChild(g);
    });
}

// Dessiner une pièce spécifique
function drawPieceShape(p) {
    if (!p.g) return;
    p.g.innerHTML = "";
    p.shape.forEach(([dx, dy]) => {
        const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        r.setAttribute("x", dx * CELL / 2);
        r.setAttribute("y", dy * CELL / 2);
        r.setAttribute("width", CELL / 2);
        r.setAttribute("height", CELL / 2);
        r.setAttribute("rx", 6);
        r.setAttribute("fill", p.color);
        p.g.appendChild(r);
    });
}

// ---------- DRAG ----------
document.onpointermove = e => {
    if (!dragged) return;
    dragged.x = e.clientX - offset.x;
    dragged.y = e.clientY - offset.y;
    if (dragged.g) dragged.g.setAttribute("transform", `translate(${dragged.x},${dragged.y})`);
};

document.onpointerup = e => {
    if (!dragged) return;
    snapAndPlace(dragged);
    dragged = null;
    drawPieces(); // repositionne toutes les pièces non posées
};

// ---------- SNAP & PLACE ----------
function snapAndPlace(p) {
    const rect = boardSVG.getBoundingClientRect();
    const gx = Math.round((p.x - rect.left) / CELL);
    const gy = Math.round((p.y - rect.top) / CELL);

    let canPlace = true;
    for (const [dx, dy] of p.shape) {
        const x = gx + dx;
        const y = gy + dy;
        if (x < 0 || x >= boardW || y < 0 || y >= boardH || board[y][x] !== 0) {
            canPlace = false;
            break;
        }
    }

    if (!canPlace) return;

    for (const [dx, dy] of p.shape) {
        board[gy + dy][gx + dx] = p.id;
    }

    p.placed = true;
    if (p.g) p.g.remove();
    drawBoard();
    checkWin();
}

// ---------- WIN ----------
function checkWin() {
    for (let y = 0; y < boardH; y++) {
        for (let x = 0; x < boardW; x++) {
            if (board[y][x] === 0) return;
        }
    }
    alert("🎉 Victoire !");
}

// ---------- UI ----------
document.getElementById("generate").onclick = () => {
    generateGame(
        +document.getElementById("w").value,
        +document.getElementById("h").value
    );
};
