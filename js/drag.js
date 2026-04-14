import { state } from "./data.js";
import { updateDragPreviewPosition } from "./drag-helpers.js";

export function initDragHandlers() {
    document.onpointermove = e => {
        if (!state.dragged) return;
        updateDragPreviewPosition(e.clientX, e.clientY);
    };

    document.onpointerdown = e => {
        if (!state.dragged || e.button !== 0) return;
        e.preventDefault();
        state.handlers.snapAndPlace(state.dragged.piece, e.clientX, e.clientY);
    };

    document.oncontextmenu = e => {
        if (!state.dragged) return;
        e.preventDefault();
        state.handlers.rotateDraggedPiece(e.clientX, e.clientY);
    };
}
