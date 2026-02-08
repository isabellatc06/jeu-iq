const board = document.getElementById("board");

// Générer 5x5 = 25 cases
for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = ""; // Tu peux mettre un numéro ou un symbole si tu veux
    board.appendChild(cell);
}
