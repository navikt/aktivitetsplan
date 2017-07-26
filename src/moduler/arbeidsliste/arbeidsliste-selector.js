export const hentArbeidsliste = state => ({
    arbeidsliste: state.data.arbeidsliste,
});

export const isOppfolgendeVeileder = state =>
    hentArbeidsliste(state).data.isOppfolgendeVeileder === true;
