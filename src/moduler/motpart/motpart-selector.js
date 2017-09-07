export const selectMotpartReducer = state => state.data.motpart;
export const selectMotpartStatus = state => state.data.motpart.status;
export const selectNavnPaMotpart = state =>
    selectMotpartReducer(state).data.navn;
