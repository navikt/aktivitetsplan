function selectBrukerSlice(state) {
    return state.data.bruker;
}

export function selectBruker(state) {
    return selectBrukerSlice(state).data;
}

export function selectBrukerStatus(state) {
    return selectBrukerSlice(state).status;
}
