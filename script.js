const board = document.getElementById("board");

// Créer le plateau principal 5x5
for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    // Autoriser le drop
    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => {
        e.preventDefault();
        const pieceId = e.dataTransfer.getData("text");
        const piece = document.getElementById(pieceId);

        // Empêcher de déposer plusieurs pièces dans la même case
        if (!cell.hasChildNodes()) {
            cell.appendChild(piece);
        }
    });

    board.appendChild(cell);
};

// Rendre les pièces draggable
const pieces = document.querySelectorAll(".piece");
pieces.forEach(piece => {
    piece.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", e.target.id);
    });
});
