import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';

export function selectIdentitetSlice(state: RootState) {
    return state.data.identitet;
}

export function selectIdentitetData(state: RootState) {
    return selectIdentitetSlice(state).data;
}

export function selectIdentitetStatus(state: RootState) {
    return selectIdentitetSlice(state).status;
}

export function selectErBruker(state: RootState) {
    return selectIdentitetSlice(state).data?.erBruker;
}

export function selectIdentitetId(state: RootState) {
    return selectIdentitetSlice(state).data?.id;
}

export function selectIdentitetFeilMelding(state: RootState) {
    const feilMeldingsdata = selectIdentitetStatus(state) === Status.ERROR && selectIdentitetSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
}
