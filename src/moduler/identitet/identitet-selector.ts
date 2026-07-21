import { GenericState } from '../../store/createGenericSlice';
import { Me } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store/rootReducer';

function selectIdentitetSlice(state: RootState): GenericState<Me> {
    return state.data.identitet;
}

export function selectIdentitetData(state: RootState) {
    return selectIdentitetSlice(state).data;
}

export function selectErBruker(state: RootState) {
    return selectIdentitetData(state)?.erBruker;
}

export function selectIdentitetStatus(state: RootState) {
    return selectIdentitetSlice(state).status;
}
