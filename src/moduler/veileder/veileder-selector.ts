import { GenericState } from '../../createGenericSlice';
import { VeilederInfo } from '../../datatypes/types';
import { RootState } from '../../store';

const selectVeilederSlice = (state: RootState): GenericState<VeilederInfo> => state.data.veileder;
const selectVeilederData = (state: RootState) => selectVeilederSlice(state).data;

export const selectVeilederNavn = (state: RootState) =>
    selectVeilederData(state)?.fornavn &&
    `${selectVeilederData(state)?.fornavn} ${selectVeilederData(state)?.etternavn}`;

export const selectVeilederStatus = (state: RootState) => selectVeilederSlice(state).status;
