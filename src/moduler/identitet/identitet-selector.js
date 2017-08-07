export function selectIdentitetReducer(state) {
    return state.data.identitet;
}

export function selectErVeileder(state) {
    return selectIdentitetReducer(state).data.erVeileder;
}

export function selectErBruker(state) {
    return selectIdentitetReducer(state).data.erBruker;
}
