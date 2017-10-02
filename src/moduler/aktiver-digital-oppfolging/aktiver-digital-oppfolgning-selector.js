export const selectAktiverDigitalOppfolgingSlice = state =>
    state.data.aktiverDigitalOppfolging;

export const selectAktiverDigitalOppfolgingStatus = state =>
    selectAktiverDigitalOppfolgingSlice(state).status;
