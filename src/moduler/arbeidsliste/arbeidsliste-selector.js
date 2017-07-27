export const hentArbeidslisteReducer = state => state.data.arbeidsliste;

export const isOppfolgendeVeileder = state =>
    hentArbeidslisteReducer(state).data.isOppfolgendeVeileder === true;
