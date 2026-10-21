import { RootState } from '../../store/rootReducer';

const selectEskaleringsvarselSlice = (state: RootState) => state.data.eskaleringsvarsel;

export const selectEskaleringsvarselData = (state: RootState) => selectEskaleringsvarselSlice(state).data;

export const selectErEskalert = (state: RootState): boolean => !!selectEskaleringsvarselData(state)?.id;
