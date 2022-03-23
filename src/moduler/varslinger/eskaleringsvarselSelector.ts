import { Eskaleringsvarsel } from '../../datatypes/dialogTypes';

const selectEskaleringsvarselSlice = (state: any) => state.data.eskaleringsvarsel;

export const selectEskaleringsvarselData = (state: any): Eskaleringsvarsel => selectEskaleringsvarselSlice(state).data;

export const selectErEskalert = (state: any): boolean => !!selectEskaleringsvarselData(state).id;
