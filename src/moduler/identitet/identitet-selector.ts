import { GenericState } from '../../createGenericSlice';
import { Me } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';

function selectIdentitetSlice(state: RootState): GenericState<Me> {
    return state.data.identitet;
}

export function selectIdentitetData(state: RootState) {
    return selectIdentitetSlice(state).data;
}

export function selectErBruker(state: RootState) {
    return selectIdentitetData(state).erBruker;
}

export function selectIdentitetId(state: RootState) {
    return selectIdentitetData(state).id;
}

export function selectIdentitetStatus(state: RootState) {
    return selectIdentitetSlice(state).status;
}
