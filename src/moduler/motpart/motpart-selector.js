export const selectMotpartSlice = state => state.data.motpart;

export const selectMotpartStatus = state => selectMotpartSlice(state).status;
export const selectMotpartData = state => selectMotpartSlice(state).data;
export const selectNavnPaMotpart = state => selectMotpartSlice(state).data.navn;
