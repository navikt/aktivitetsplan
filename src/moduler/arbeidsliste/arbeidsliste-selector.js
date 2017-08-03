export const selectArbeidslisteReducer = state => state.data.arbeidsliste;

export const selectHarVeilederTilgang = state =>
    selectArbeidslisteReducer(state).data.harVeilederTilgang;

export const selectIsOppfolgendeVeileder = state =>
    selectArbeidslisteReducer(state).data.isOppfolgendeVeileder || false;

export const selectErBrukerIArbeidsliste = state =>
    Object.keys(selectArbeidslisteReducer(state).data).length > 0;
