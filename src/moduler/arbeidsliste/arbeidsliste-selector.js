export const hentArbeidslisteReducer = state => state.data.arbeidsliste;
export const hentHarVeilederTilgang = state =>
    hentArbeidslisteReducer(state).data.harVeilederTilgang;
export const hentBrukerTilhorerVeileder = state =>
    hentArbeidslisteReducer(state).data.isOppfolgendeVeileder || false;
export const erBrukerIArbeidsliste = state =>
    Object.keys(hentArbeidslisteReducer(state).data).length > 0;
