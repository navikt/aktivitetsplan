export const hentArbeidslisteReducer = state => state.data.arbeidsliste;

export const erBrukerIArbeidsliste = state =>
    Object.keys(hentArbeidslisteReducer(state).data).length > 0;
