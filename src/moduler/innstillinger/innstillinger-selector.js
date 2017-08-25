function selectInnstillingerSlice(state) {
    return state.data.innstillinger;
}

export function selectInnstillingerStatus(state) {
    return selectInnstillingerSlice(state).status;
}

export function selectInaktiveringsDato(state) {
    return selectInnstillingerSlice(state).data.inaktiveringsDato;
}
