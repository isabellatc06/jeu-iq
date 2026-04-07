const CELL = 50; //taille du tableau

let board = []; //tableau
let boardW = 0;
let boardH = 0;
let obstacles = [];
let pieces = []; //liste de pieces 

let dragged = null;
let offset = { x: 0, y: 0 };

//references aux <svg> du HTML
const boardSVG = document.getElementById("board");
const piecesSVG = document.getElementById("pieces");


// ---------- UTILS ----------
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// ---------- GAME ----------

//cration du tableau selon la longueur et la largeur
function generateGame(w, h) {
    boardW = w;
    boardH = h;

    obstacles = generateObstacles(w, h); //met les obstacle aleatoirement
    board = initBoard(w, h, obstacles); //cree le tableau avec obstacles
    pieces = generateSimplePieces(w, h, obstacles); //cree les pieces selon les cases qui restent

    drawBoard(); //dessine les cases du tableau 
    drawPieces(); //dessine les pieces
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

    // Auto-zoom
    const maxW = window.innerWidth * 0.45;
    const maxH = window.innerHeight * 0.7;

    const scale = Math.min(maxW / (boardW * CELL), maxH / (boardH * CELL), 1);

    boardSVG.style.transform = `scale(${scale})`;
    boardSVG.dataset.scale = scale; // 🔥 indispensable

    // dessin des cases
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
    piecesSVG.setAttribute("width", 300);
    piecesSVG.setAttribute("height", Math.max(400, pieces.length * 80));


    pieces.forEach((p, index) => {

        // Posición en el plato SIEMPRE
        if (!dragged || dragged !== p) {
            p.x = 20;
            p.y = index * 70;
        }

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.classList.add("piece");
        g.setAttribute("transform", `translate(${p.x},${p.y})`);
        p.g = g;

        // dibujar forma
        p.shape.forEach(([dx, dy]) => {
            const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            r.setAttribute("x", dx * CELL / 2);
            r.setAttribute("y", dy * CELL / 2);
            r.setAttribute("width", CELL / 2);
            r.setAttribute("height", CELL / 2);
            r.setAttribute("rx", 6);
            r.setAttribute("fill", p.color);
            g.appendChild(r);
        });

        // eventos
        g.onpointerdown = e => {
            dragged = p;
            
            offset.x = e.clientX - p.x;
            offset.y = e.clientY - p.y;

            g.setPointerCapture(e.pointerId);

            // poner encima
            piecesSVG.appendChild(g);
        };

        g.ondblclick = () => {
            p.shape = p.shape.map(([x, y]) => [-y, x]);
            drawPieces();
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
    const scale = parseFloat(boardSVG.dataset.scale || 1);

    // coordonnées du centre de la pièce en pixels écran
    const screenX = p.x;
    const screenY = p.y;

    // conversion écran → coordonnées plateau
    const localX = (screenX - rect.left) / scale;
    const localY = (screenY - rect.top) / scale;

    const gx = Math.round(localX / CELL);
    const gy = Math.round(localY / CELL);

    // 🧹 1. Limpiar posición anterior de la pieza
    for (let y = 0; y < boardH; y++) {
        for (let x = 0; x < boardW; x++) {
            if (board[y][x] === p.id) {
                board[y][x] = 0;
            }
        }
    }

    // 🔍 2. Verificar si se puede colocar
    let canPlace = true;
    for (const [dx, dy] of p.shape) {
        const x = gx + dx;
        const y = gy + dy;

        if (
            x < 0 || x >= boardW ||
            y < 0 || y >= boardH ||
            board[y][x] !== 0
        ) {
            canPlace = false;
            break;
        }
    }

    // ❌ 3. Si NO encaja → volver al plato
    if (!canPlace) {
        p.placed = false;
        p.x = 20;
        p.y = p.id * 70;

        if (p.g) {
            p.g.setAttribute("transform", `translate(${p.x},${p.y})`);
        }

        drawBoard();
        return;
    }

    // ✅ 4. Colocar en nueva posición
    for (const [dx, dy] of p.shape) {
        board[gy + dy][gx + dx] = p.id;
    }

    p.placed = true;

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
