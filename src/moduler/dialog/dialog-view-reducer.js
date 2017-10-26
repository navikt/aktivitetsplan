// Actions
export const BEKREFTELSE = 'dialog-view/bekreftelse';

const initalState = {
    data: {},
};

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case BEKREFTELSE:
            return {
                ...state,
                data,
            };
        default:
            return state;
    }
}

// Action creator
export function visBekreftelse(dialogId, utlopTidspunkt) {
    return {
        type: BEKREFTELSE,
        data: {
            dialogId,
            utlopTidspunkt,
        },
    };
}
