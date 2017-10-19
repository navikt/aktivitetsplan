export const selectArbeidslisteReducer = state => state.data.arbeidsliste;

export const selectHarVeilederTilgang = state =>
    selectArbeidslisteReducer(state).data.harVeilederTilgang;

export const selectIsOppfolgendeVeileder = state =>
    selectArbeidslisteReducer(state).data.isOppfolgendeVeileder || false;

export const selectEndretDato = state =>
    selectArbeidslisteReducer(state).data.endringstidspunkt;

export const selectSistEndretAv = state => {
    const sistEndretAv = selectArbeidslisteReducer(state).data.sistEndretAv;
    return sistEndretAv && sistEndretAv.veilederId;
};

export const selectErBrukerIArbeidsliste = state => !!selectEndretDato(state);
