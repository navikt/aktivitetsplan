// Actions
export const TOGGLE_DIALOG = 'underlementer-view/toggle-dialog';
export const TOGGLE_HISTORIKK = 'underlementer-view/toggle-historikk';

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
