const CELL = 50; // taille du tableau

let board = [];
let boardW = 0;
let boardH = 0;
let obstacles = [];
let pieces = [];

let dragged = null;
let dragOrigin = null;
let offset = { x: 0, y: 0 };
let gameWon = false;
let winTimer = null;
let returnToStartupTimer = null;

const boardSVG = document.getElementById("board");
const piecesSVG = document.getElementById("pieces");
const generateButton = document.getElementById("generate");
const resetButton = document.getElementById("reset-placed");
const hintText = document.querySelector(".hint");
const difficultySelect = document.getElementById("difficulty");
const widthInput = document.getElementById("w");
const heightInput = document.getElementById("h");
const obstacleRatioInput = document.getElementById("obstacle-ratio");
const pieceMinInput = document.getElementById("piece-min");
const pieceMaxInput = document.getElementById("piece-max");

const difficultyPresets = {
    easy: { w: 5, h: 5, obstacleRatio: 0.1, pieceMin: 3, pieceMax: 4, label: "Facile" },
    normal: { w: 6, h: 6, obstacleRatio: 0.15, pieceMin: 3, pieceMax: 5, label: "Moyen" },
    hard: { w: 8, h: 8, obstacleRatio: 0.2, pieceMin: 4, pieceMax: 6, label: "Difficile" },
    custom: { w: 6, h: 6, obstacleRatio: 0.15, pieceMin: 3, pieceMax: 5, label: "Personnalise" }
};

let gameSettings = { ...difficultyPresets.normal };

let gameStarted = false;

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
const getShapeBounds = shape => {
    const maxX = Math.max(...shape.map(([x]) => x));
    const maxY = Math.max(...shape.map(([, y]) => y));
    return {
        width: maxX + 1,
        height: maxY + 1
    };
};
const rotateShape = shape => normalizeShape(shape.map(([x, y]) => [-y, x]));
const flipShape = shape => normalizeShape(shape.map(([x, y]) => [-x, y]));

// ---------- GAME ----------
function generateGame(w, h) {
    boardW = w;
    boardH = h;
    gameWon = false;
    clearTimeout(winTimer);
    clearTimeout(returnToStartupTimer);
    hideWinMessage();

    obstacles = generateObstacles(w, h, gameSettings.obstacleRatio);
    board = initBoard(w, h, obstacles);
    pieces = generateSimplePieces(w, h, obstacles, gameSettings.pieceMin, gameSettings.pieceMax);

    drawBoard();
    drawPieces();
}

function setGameStartedUI(started) {
    gameStarted = started;
    document.body.classList.toggle("startup", !started);
    generateButton.textContent = started ? "Générer nouveau" : "Commencer";
    resetButton.style.display = started ? "inline-block" : "none";
    hintText.style.display = started ? "none" : "block";
    hintText.textContent = "Choisis une difficulte, puis clique sur Commencer";

}

function updateSettingsFromDifficulty() {
    const selected = difficultyPresets[difficultySelect.value] || difficultyPresets.normal;
    gameSettings = { ...selected };

    const isCustom = difficultySelect.value === "custom";
    widthInput.disabled = !isCustom;
    heightInput.disabled = !isCustom;
    obstacleRatioInput.disabled = !isCustom;
    pieceMinInput.disabled = !isCustom;
    pieceMaxInput.disabled = !isCustom;

    if (!isCustom) {
        widthInput.value = selected.w;
        heightInput.value = selected.h;
        obstacleRatioInput.value = Math.round(selected.obstacleRatio * 100);
        pieceMinInput.value = selected.pieceMin;
        pieceMaxInput.value = selected.pieceMax;
    }

    if (!gameStarted) {
        hintText.textContent = "Choisis une difficulte, puis clique sur Commencer";
    }

}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function updateSettingsFromCustomInputs() {
    const w = clamp(+widthInput.value || 6, 4, 10);
    const h = clamp(+heightInput.value || 6, 4, 10);
    const obstaclePercent = clamp(+obstacleRatioInput.value || 15, 5, 35);
    let pieceMin = clamp(+pieceMinInput.value || 3, 2, 6);
    let pieceMax = clamp(+pieceMaxInput.value || 5, 3, 7);

    if (pieceMin > pieceMax) {
        pieceMax = pieceMin;
    }

    widthInput.value = w;
    heightInput.value = h;
    obstacleRatioInput.value = obstaclePercent;
    pieceMinInput.value = pieceMin;
    pieceMaxInput.value = pieceMax;

    gameSettings = {
        w,
        h,
        obstacleRatio: obstaclePercent / 100,
        pieceMin,
        pieceMax,
        label: "Personnalise"
    };

}

// ---------- OBSTACLES ----------
function generateObstacles(w, h, obstacleRatio = 0.15) {
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const count = Math.floor(w * h * obstacleRatio);

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
                if (dragged) return;
                e.preventDefault();
                e.stopPropagation();
                startDragFromBoard(piece, e);
            };

            boardSVG.appendChild(g);
        });
}

// ---------- PIECES ----------
function generateSimplePieces(w, h, obs, pieceMin = 3, pieceMax = 5) {
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

        let targetSize = rand(pieceMin, pieceMax);
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

// ---------- DRAW PIECES ----------
function drawPieces() {
    piecesSVG.innerHTML = "";
    const trayRowHeight = 80;
    const trayColWidth = 110;
    const trayPadding = 20;
    const trayInnerWidth = trayColWidth - 20;
    const trayInnerHeight = trayRowHeight - 20;
    const preferredHeight = Math.max(280, boardH * CELL);
    const rowsPerColumn = Math.max(1, Math.floor((preferredHeight - trayPadding * 2) / trayRowHeight));
    const visibleRows = Math.max(1, Math.min(rowsPerColumn, pieces.length));
    const columnCount = Math.max(1, Math.ceil(pieces.length / rowsPerColumn));
    const trayWidth = trayPadding + columnCount * trayColWidth - 10;
    const trayHeight = trayPadding + visibleRows * trayRowHeight;

    piecesSVG.setAttribute("width", trayWidth);
    piecesSVG.setAttribute("height", trayHeight);

    pieces.forEach(piece => {
        const column = Math.floor(piece.trayIndex / rowsPerColumn);
        const row = piece.trayIndex % rowsPerColumn;
        const trayX = trayPadding + column * trayColWidth;
        const trayY = trayPadding + row * trayRowHeight;
        const bounds = getShapeBounds(piece.shape);
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
        piecesSVG.appendChild(slot);

        if (piece.placed || (dragged && dragged.piece === piece)) {
            return;
        }

        const g = createPieceGroup(piece, unit);
        g.setAttribute("transform", `translate(${offsetX},${offsetY})`);

        g.onpointerdown = e => {
            if (dragged) return;
            e.preventDefault();
            e.stopPropagation();
            startDragFromTray(piece, e, trayX, trayY);
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
    preview.style.position = "fixed";
    preview.style.left = "0";
    preview.style.top = "0";
    preview.style.transformOrigin = "top left";
    preview.style.pointerEvents = "none";

    const g = createPieceGroup(piece, CELL);
    preview.appendChild(g);
    dragLayer.appendChild(preview);

    return preview;
}

// ---------- DRAG START ----------
function startDragFromTray(piece, event, trayX, trayY) {
    if (gameWon) return;

    dragged = {
        piece,
        preview: createDragPreview(piece)
    };

    dragOrigin = { placed: false };

    const trayRect = piecesSVG.getBoundingClientRect();
    offset.x = event.clientX - (trayRect.left + trayX);
    offset.y = event.clientY - (trayRect.top + trayY);

    updateDragPreviewPosition(event.clientX, event.clientY);
    drawPieces();
}

function startDragFromBoard(piece, event) {
    if (gameWon) return;

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

function rotateDraggedPiece(clientX, clientY) {
    if (!dragged) return;

    dragged.piece.shape = rotateShape(dragged.piece.shape);
    dragged.preview = createDragPreview(dragged.piece);
    updateDragPreviewPosition(clientX, clientY);
}

// ---------- DRAG HELPERS ----------
function updateDragPreviewPosition(clientX, clientY) {
    if (!dragged) return;
    const scale = parseFloat(boardSVG.dataset.scale || 1);
    dragged.preview.setAttribute(
        "style",
        `position: fixed; left: 0; top: 0; overflow: visible; pointer-events: none; transform-origin: top left; transform: translate(${clientX - offset.x}px, ${clientY - offset.y}px) scale(${scale});`
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
function isBlockedCell(x, y) {
    return (
        x < 0 ||
        x >= boardW ||
        y < 0 ||
        y >= boardH ||
        obstacles[y][x] === -1 ||
        board[y][x] !== 0
    );
}

function canPlaceAt(piece, gx, gy) {
    for (const [dx, dy] of piece.shape) {
        const x = gx + dx;
        const y = gy + dy;

        if (isBlockedCell(x, y)) {
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

document.onpointerdown = e => {
    if (!dragged || e.button !== 0) return;
    e.preventDefault();
    snapAndPlace(dragged.piece, e.clientX, e.clientY);
};

document.oncontextmenu = e => {
    if (!dragged) return;
    e.preventDefault();
    rotateDraggedPiece(e.clientX, e.clientY);
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
function showWinMessage() {
    let message = document.getElementById("win-message");

    if (!message) {
        message = document.createElement("div");
        message.id = "win-message";
        message.className = "win-message";
        message.innerHTML = "\n            <strong>Bravo !</strong> Puzzle complete.\n            <button id=\"win-new-game\" type=\"button\">Retour accueil</button>\n        ";
        document.body.appendChild(message);

        const newGameButton = message.querySelector("#win-new-game");
        newGameButton.onclick = () => returnToStartup();
    }

    message.classList.add("show");
}

function hideWinMessage() {
    const message = document.getElementById("win-message");
    if (!message) return;
    message.classList.remove("show");
}

function returnToStartup() {
    clearTimeout(winTimer);
    clearTimeout(returnToStartupTimer);

    dragged = null;
    dragOrigin = null;
    dragLayer.innerHTML = "";
    gameWon = false;

    board = [];
    obstacles = [];
    pieces = [];
    boardW = 0;
    boardH = 0;
    boardSVG.innerHTML = "";
    piecesSVG.innerHTML = "";
    boardSVG.removeAttribute("width");
    boardSVG.removeAttribute("height");
    piecesSVG.removeAttribute("width");
    piecesSVG.removeAttribute("height");

    hideWinMessage();
    setGameStartedUI(false);
}

function checkWin() {
    if (gameWon) return;

    for (let y = 0; y < boardH; y++) {
        for (let x = 0; x < boardW; x++) {
            if (board[y][x] === 0) return;
        }
    }

    gameWon = true;
    clearTimeout(winTimer);
    clearTimeout(returnToStartupTimer);
    winTimer = setTimeout(() => {
        requestAnimationFrame(() => {
            showWinMessage();
            returnToStartupTimer = setTimeout(() => {
                returnToStartup();
            }, 1800);
        });
    }, 120);
}

function resetPlacedPieces() {
    gameWon = false;
    clearTimeout(winTimer);
    clearTimeout(returnToStartupTimer);
    hideWinMessage();

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
generateButton.onclick = () => {
    updateSettingsFromDifficulty();
    if (difficultySelect.value === "custom") {
        updateSettingsFromCustomInputs();
    }

    if (!gameStarted) {
        setGameStartedUI(true);
    }

    generateGame(
        gameSettings.w,
        gameSettings.h
    );
};

resetButton.onclick = () => {
    resetPlacedPieces();
};

difficultySelect.onchange = () => {
    updateSettingsFromDifficulty();
};

[widthInput, heightInput, obstacleRatioInput, pieceMinInput, pieceMaxInput].forEach(input => {
    input.onchange = () => {
        if (difficultySelect.value !== "custom") return;
        updateSettingsFromCustomInputs();
    };
});

updateSettingsFromDifficulty();
setGameStartedUI(false);
