export function selectIdentitetSlice(state) {
    return state.data.identitet;
}

export function selectIdentitetStatus(state) {
    return selectIdentitetSlice(state).status;
}

export function selectErVeileder(state) {
    return selectIdentitetSlice(state).data.erVeileder;
}

export function selectErBruker(state) {
    return selectIdentitetSlice(state).data.erBruker;
}

export function selectIdentitetId(state) {
    return selectIdentitetSlice(state).data.id;
}
