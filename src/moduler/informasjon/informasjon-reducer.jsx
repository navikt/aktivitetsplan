const informasjonBackPath = 'informasjon/backpath';

const initalState = {
    backPath: '/',
};

export default function informasjonReducer(state = initalState, action) {
    const backPath = action.data;

    switch (action.type) {
        case informasjonBackPath:
            return {
                ...state,
                backPath,
            };
        default:
            return state;
    }
}

export function setBackPath(path) {
    return {
        type: informasjonBackPath,
        data: path,
    };
}

export function selectBackPath(state) {
    return state.view.informasjon.backPath;
}
