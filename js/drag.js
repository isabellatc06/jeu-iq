import { state } from "./data.js";
import { updateDragPreviewPosition } from "./drag-helpers.js";

// Branche les ecouteurs globaux utilises pendant le drag and drop.
// On utilise des handlers document-level pour garder le controle
// meme si la souris sort des zones SVG.
export function initDragHandlers() {
    document.onpointermove = e => {
        // Pendant le drag, l'apercu suit exactement le pointeur.
        if (!state.dragged) return;
        updateDragPreviewPosition(e.clientX, e.clientY);
    };

    document.onpointerdown = e => {
        // Clic gauche pendant un drag = tentative de pose.
        if (!state.dragged || e.button !== 0) return;
        e.preventDefault();
        state.handlers.snapAndPlace(state.dragged.piece, e.clientX, e.clientY);
    };

    document.oncontextmenu = e => {
        // Clic droit pendant un drag = rotation de la piece en main.
        if (!state.dragged) return;
        e.preventDefault();
        state.handlers.rotateDraggedPiece(e.clientX, e.clientY);
    };
}
