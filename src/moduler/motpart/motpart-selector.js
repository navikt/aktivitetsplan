export const selectMotpartReducer = state => state.data.motpart;
export const selectNavnPaMotpart = state =>
    selectMotpartReducer(state).data.navn;
