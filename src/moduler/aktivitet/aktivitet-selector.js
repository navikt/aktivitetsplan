import { STATUS } from '../../ducks/utils';

function selectAktiviteterSlice(state) {
    return state.data.aktiviteter;
}

export function selectAktiviteterData(state) {
    return selectAktiviteterSlice(state).data;
}

export function selectAktivitetStatus(state) {
    return selectAktiviteterSlice(state).status;
}

export function selectForrigeAktiveAktivitetId(state) {
    return selectAktiviteterSlice(state).forrigeAktiveAktivitetId;
}

export function selectHarTilgangTilAktiviteter(state) {
    return selectAktivitetStatus(state) === STATUS.OK;
}
