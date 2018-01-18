export function selectVeilederTilgangSlice(state) {
    return state.data.veilederTilgang;
}

function selectVeilederTilgangData(state) {
    return selectVeilederTilgangSlice(state).data;
}

export function selectTilgangTilBrukersKontor(state) {
    return selectVeilederTilgangData(state).tilgangTilBrukersKontor;
}
