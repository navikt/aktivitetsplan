export const selectArbeidsliste = state => ({
    arbeidsliste: state.data.arbeidsliste.data,
});

export const isOppfolgendeVeileder = state =>
    state.data.arbeidsliste.data.isOppfolgendeVeileder === true;
