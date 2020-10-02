function selectTilgangSlice(state) {
    return state.data.tilgang;
}

export function selectTilgang(state) {
    return selectTilgangSlice(state).data;
}

export function selectNivaa4(state) {
    return selectTilgang(state).harbruktnivaa4;
}
