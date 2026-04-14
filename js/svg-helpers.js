import { CELL, dragLayer, state } from "./data.js";

// Construit un groupe SVG representant une piece.
// unit permet de reutiliser la meme forme pour:
// - le plateau (taille CELL)
// - la reserve (taille reduite)
export function createPieceGroup(piece, unit) {
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

// Cree l'apercu flottant qui suit la souris pendant le drag.
// Le preview occupe un SVG "tampon" assez grand pour contenir la piece quelle que soit sa rotation.
export function createDragPreview(piece) {
    dragLayer.innerHTML = "";

    const preview = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    preview.classList.add("drag-preview");
    preview.setAttribute("width", state.boardW * CELL);
    preview.setAttribute("height", state.boardH * CELL);
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
