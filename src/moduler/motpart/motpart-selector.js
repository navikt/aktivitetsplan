export function selectMotpartSlice(state) {
    return state.data.motpart;
}

export function selectMotpartStatus(state) {
    return selectMotpartSlice(state).status;
}

export function selectMotpartData(state) {
    return selectMotpartSlice(state).data;
}

export function selectNavnPaMotpart(state) {
    return selectMotpartSlice(state).data.navn;
}
