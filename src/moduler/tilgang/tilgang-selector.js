import { Status } from '../../createGenericSlice';

function selectTilgangSlice(state) {
    return state.data.tilgang;
}

export function selectTilgang(state) {
    return selectTilgangSlice(state).data;
}

export function selectNivaa4(state) {
    return selectTilgang(state) ? selectTilgang(state).harbruktnivaa4 : false;
}

export function selectNivaa4LastetOk(state) {
    return selectNivaa4Status(state) === Status.OK;
}

export function selectNivaa4Status(state) {
    return selectTilgangSlice(state).status;
}

export function selectNivaa4Feilmeldinger(state) {
    const feilmeldinger = selectTilgangSlice(state).status === Status.ERROR && selectTilgangSlice(state).feil;
    return feilmeldinger ? feilmeldinger : [];
}
