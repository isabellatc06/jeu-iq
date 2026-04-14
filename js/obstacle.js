import { rand } from "./utils.js";

// Genere une matrice d'obstacles aleatoire.
// Note: des collisions peuvent arriver (meme case tiree plusieurs fois),
// donc le nombre final d'obstacles peut etre legerement inferieur a "count".
export function generateObstacles(w, h, obstacleRatio = 0.15) {
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const count = Math.floor(w * h * obstacleRatio);

    for (let i = 0; i < count; i++) {
        grid[rand(0, h - 1)][rand(0, w - 1)] = -1;
    }

    return grid;
}
