function selectLedeteksterSlice(state) {
    return state.data.ledetekster;
}

export function selectLedeteksterData(state) {
    return selectLedeteksterSlice(state).data;
}

export function selectLedeteksterStatus(state) {
    return selectLedeteksterSlice(state).status;
}
