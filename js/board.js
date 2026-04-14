import { CELL, refs, state } from "./data.js";
import { createPieceGroup } from "./svg-helpers.js";

// Cree la grille logique de jeu.
// Convention:
// - 0  : case libre
// - -1 : obstacle
// - >0 : identifiant de piece posee
export function initBoard(w, h, obs) {
    return Array.from({ length: h }, (_, y) =>
        Array.from({ length: w }, (_, x) => (obs[y][x] === -1 ? -1 : 0))
    );
}

// Redessine completement le plateau principal.
// Cette fonction:
// 1) reconstruit les cases du fond
// 2) applique une mise a l'echelle responsive
// 3) reaffiche les pieces deja placees (cliquables pour reprise)
export function drawBoard() {
    refs.boardSVG.innerHTML = "";
    refs.boardSVG.setAttribute("width", state.boardW * CELL);
    refs.boardSVG.setAttribute("height", state.boardH * CELL);

    // Limites visuelles dans la page: le plateau reste lisible
    // sans depasser la zone reservee a gauche.
    const maxW = window.innerWidth * 0.45;
    const maxH = window.innerHeight * 0.7;
    const scale = Math.min(maxW / (state.boardW * CELL), maxH / (state.boardH * CELL), 1);

    refs.boardSVG.style.transform = `scale(${scale})`;
    refs.boardSVG.dataset.scale = scale;

    for (let y = 0; y < state.boardH; y++) {
        for (let x = 0; x < state.boardW; x++) {
            const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            r.setAttribute("x", x * CELL);
            r.setAttribute("y", y * CELL);
            r.setAttribute("width", CELL);
            r.setAttribute("height", CELL);
            r.setAttribute("rx", 8);
            // Obstacles en sombre, cases jouables en clair.
            r.setAttribute("fill", state.board[y][x] === -1 ? "#444" : "#eee");
            r.setAttribute("stroke", "#333");
            refs.boardSVG.appendChild(r);
        }
    }

    // Les pieces deja posees sont redessinees par-dessus la grille.
    // PointerDown sur une piece posee = reprise de la piece depuis le plateau.
    state.pieces
        .filter(piece => piece.placed)
        .forEach(piece => {
            const g = createPieceGroup(piece, CELL);
            g.setAttribute("transform", `translate(${piece.boardX * CELL},${piece.boardY * CELL})`);

            g.onpointerdown = e => {
                if (state.dragged) return;
                e.preventDefault();
                e.stopPropagation();
                state.handlers.startDragFromBoard(piece, e);
            };

            refs.boardSVG.appendChild(g);
        });
}
