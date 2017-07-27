export const hentArbeidsliste = state => state.data.arbeidsliste;

export const isOppfolgendeVeileder = state =>
    hentArbeidsliste(state).data.isOppfolgendeVeileder === true;
