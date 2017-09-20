function selectIdentitetSlice(state) {
    return state.data.identitet;
}

export function selectIdentitetReducer(state) {
    return state.data.identitet;
}

export function selectIdentitetStatus(state) {
    return selectIdentitetSlice(state).status;
}

export function selectErVeileder(state) {
    return selectIdentitetReducer(state).data.erVeileder;
}

export function selectErBruker(state) {
    return selectIdentitetReducer(state).data.erBruker;
}
