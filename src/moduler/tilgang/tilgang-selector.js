import { STATUS } from '../../ducks/utils';

function selectTilgangSlice(state) {
    return state.data.tilgang;
}

export function selectTilgang(state) {
    return selectTilgangSlice(state).data;
}

export function selectNivaa4(state) {
    return selectTilgang(state) && selectNivaa4Status(state) === STATUS.OK ? selectTilgang(state).harbruktnivaa4 : true;
}

export function selectNivaa4Status(state) {
    return selectTilgangSlice(state).status;
}

export function selectNivaa4Feilmeldinger(state) {
    const feilmeldinger = selectTilgangSlice(state).status === STATUS.ERROR && selectTilgangSlice(state).feil;
    return feilmeldinger ? feilmeldinger : [];
}
