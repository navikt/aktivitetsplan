const OPEN_INFORMASJON = 'informasjon/open';
const OPNED_AUTOMATISK = 'informasjon/openautomatisk';

const initalState = {
    open: false,
    opnedAutomatisk: false,
};

// Reducer
export default function reducer(state = initalState, action) {
    const open = action.open;
    const opnedAutomatisk = action.opnedAutomatisk;
    switch (action.type) {
        case OPEN_INFORMASJON:
            return {
                ...state,
                open,
            };
        case OPNED_AUTOMATISK:
            return {
                ...state,
                opnedAutomatisk,
            };
        default:
            return state;
    }
}

export function automatiskOpning() {
    return {
        type: OPNED_AUTOMATISK,
        opnedAutomatisk: true,
    };
}

export function visInformasjon(vis) {
    return {
        type: OPEN_INFORMASJON,
        open: vis,
    };
}

export function informasjonErOpen(state) {
    return state.view.informasjon.open;
}

export function alleredeAutomatiskOpned(state) {
    return state.view.informasjon.opnedAutomatisk;
}
