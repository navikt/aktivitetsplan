export const selectVeilederSlice = (state: any) => state.data.veileder;

export const selectVeilederData = (state: any) => selectVeilederSlice(state).data;

export const selectVeilederNavn = (state: any) =>
    `${selectVeilederData(state).fornavn} ${selectVeilederData(state).etternavn}`;

export const selectVeilederStatus = (state: any) => selectVeilederSlice(state).status;
