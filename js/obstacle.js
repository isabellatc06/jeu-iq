import { rand } from "./utils.js";

// Génère une grille d'obstacles simple en marquant certaines cases avec -1.
export function generateObstacles(w, h, obstacleRatio = 0.15) {
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const count = Math.floor(w * h * obstacleRatio);

    for (let i = 0; i < count; i++) {
        grid[rand(0, h - 1)][rand(0, w - 1)] = -1;
    }

    return grid;
}
