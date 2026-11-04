import { RootState } from '../../store/rootReducer';

export const selectPersonNavn = (state: RootState) => state.data.person.data?.navn;
export const selectPersonStatus = (state: RootState) => state.data.person.status;
