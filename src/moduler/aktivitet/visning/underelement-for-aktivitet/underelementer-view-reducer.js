// Actions
export const TOGGLE_DIALOG = 'underlementer-view/toggle-dialog';
export const APNE_DIALOG = 'underlementer-view/apne-dialog';
export const TOGGLE_HISTORIKK = 'underlementer-view/toggle-historikk';
export const LUKK_ALLE = 'underlementer-view/lukk-alle';

const initalState = {
    visDialog: false,
    visHistorikk: false,
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case TOGGLE_DIALOG:
            return {
                visDialog: !state.visDialog,
                visHistorikk: false,
            };
        case TOGGLE_HISTORIKK:
            return {
                visDialog: false,
                visHistorikk: !state.visHistorikk,
            };
        case APNE_DIALOG:
            return {
                visDialog: true,
                visHistorikk: false,
            };
        case LUKK_ALLE:
            return initalState;
        default:
            return state;
    }
}

// Action creator
export function toggleDialog() {
    return {
        type: TOGGLE_DIALOG,
    };
}

export function toggleHistorikk() {
    return {
        type: TOGGLE_HISTORIKK,
    };
}

export function apneDialog() {
    return {
        type: APNE_DIALOG,
    };
}

export function lukkAlle() {
    return {
        type: LUKK_ALLE,
    };
}
