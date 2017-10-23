function selectArbeidslisteSlice(state) {
    return state.data.arbeidsliste;
}

export function selectArbeidslisteData(state) {
    return selectArbeidslisteSlice(state).data;
}

export function selectArbeidslisteStatus(state) {
    return selectArbeidslisteSlice(state).status;
}

export function selectHarVeilederTilgang(state) {
    return selectArbeidslisteData(state).harVeilederTilgang;
}
export function selectIsOppfolgendeVeileder(state) {
    return selectArbeidslisteData(state).isOppfolgendeVeileder || false;
}
export function selectEndretDato(state) {
    return selectArbeidslisteData(state).endringstidspunkt;
}

export function selectSistEndretAv(state) {
    const sistEndretAv = selectArbeidslisteData(state).sistEndretAv;
    return sistEndretAv && sistEndretAv.veilederId;
}

export function selectErBrukerIArbeidsliste(state) {
    return !!selectEndretDato(state);
}
