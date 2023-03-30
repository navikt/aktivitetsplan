import { STATUS } from '../../api/utils';

export function selectIdentitetSlice(state) {
    return state.data.identitet;
}

export function selectIdentitetData(state) {
    return selectIdentitetSlice(state).data;
}

export function selectIdentitetStatus(state) {
    return selectIdentitetSlice(state).status;
}

export function selectErBruker(state) {
    return selectIdentitetSlice(state).data.erBruker;
}

export function selectIdentitetId(state) {
    return selectIdentitetSlice(state).data.id;
}

export function selectIdentitetFeilMelding(state) {
    const feilMeldingsdata = selectIdentitetStatus(state) === STATUS.ERROR && selectIdentitetSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
}
