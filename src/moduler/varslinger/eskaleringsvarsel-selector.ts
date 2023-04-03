import { RootState } from '../../store';

const selectEskaleringsvarselSlice = (state: RootState) => state.data.eskaleringsvarsel;

export const selectEskaleringsvarselData = (state: RootState) => selectEskaleringsvarselSlice(state).data;

export const selectEskaleringsvarselStatus = (state: RootState) => selectEskaleringsvarselSlice(state).status;

export const selectErEskalert = (state: RootState): boolean => !!selectEskaleringsvarselData(state)?.id;
