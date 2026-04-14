export const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = rand(0, i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const normalizeShape = cells => {
    // Ramène une forme à l'origine pour comparer et redessiner les pièces proprement.
    const minX = Math.min(...cells.map(([x]) => x));
    const minY = Math.min(...cells.map(([, y]) => y));
    return cells
        .map(([x, y]) => [x - minX, y - minY])
        .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
};

export const getShapeBounds = shape => {
    const maxX = Math.max(...shape.map(([x]) => x));
    const maxY = Math.max(...shape.map(([, y]) => y));
    return {
        width: maxX + 1,
        height: maxY + 1
    };
};

export const rotateShape = shape => normalizeShape(shape.map(([x, y]) => [-y, x]));
export const flipShape = shape => normalizeShape(shape.map(([x, y]) => [-x, y]));

export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
