// Nombre entier aleatoire inclusif entre a et b.
export const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// Melange de Fisher-Yates en place.
export const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = rand(0, i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const normalizeShape = cells => {
    // Ramene une forme a l'origine (0,0) puis trie les cases.
    // Cela facilite la comparaison des formes et simplifie les rendus SVG.
    const minX = Math.min(...cells.map(([x]) => x));
    const minY = Math.min(...cells.map(([, y]) => y));
    return cells
        .map(([x, y]) => [x - minX, y - minY])
        .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
};

// Calcule la largeur/hauteur minimales d'une forme (en nombre de cases).
export const getShapeBounds = shape => {
    const maxX = Math.max(...shape.map(([x]) => x));
    const maxY = Math.max(...shape.map(([, y]) => y));
    return {
        width: maxX + 1,
        height: maxY + 1
    };
};

// Rotation 90 degres antihoraire autour de l'origine, puis normalisation.
export const rotateShape = shape => normalizeShape(shape.map(([x, y]) => [-y, x]));
// Symetrie horizontale autour de l'axe vertical, puis normalisation.
export const flipShape = shape => normalizeShape(shape.map(([x, y]) => [-x, y]));

// Contraint une valeur numerique dans [min, max].
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
