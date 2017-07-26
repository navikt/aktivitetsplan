export const hentMotpart = state => state.data.motpart;
export const hentNavnPaMotpart = state => hentMotpart(state).data.navn;
