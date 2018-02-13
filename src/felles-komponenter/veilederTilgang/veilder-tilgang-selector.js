export function selectVeilederTilgangSlice(state) {
    return state.data.veilederTilgang;
}

export function selectVeilederTilgangStatus(state) {
    return selectVeilederTilgangSlice(state).status;
}

function selectVeilederTilgangData(state) {
    return selectVeilederTilgangSlice(state).data;
}

export function selectTilgangTilBrukersKontor(state) {
    return selectVeilederTilgangData(state).tilgangTilBrukersKontor;
}
