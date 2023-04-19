import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectFeil } from '../feilmelding/feil-selector';
import { hentNivaa4 } from './tilgang-slice';

function selectTilgangSlice(state: RootState) {
    return state.data.tilgang;
}

function selectTilgangData(state: RootState) {
    return selectTilgangSlice(state).data;
}

export function selectNivaa4(state: RootState) {
    return selectTilgangData(state) ? selectTilgangData(state).harbruktnivaa4 : false;
}

export function selectNivaa4LastetOk(state: RootState) {
    return selectNivaa4Status(state) === Status.OK;
}

export function selectNivaa4Status(state: RootState) {
    return selectTilgangSlice(state).status;
}

export function selectNivaa4Feilmeldinger(state: RootState) {
    return selectTilgangSlice(state).status === Status.ERROR ? selectFeil(hentNivaa4.rejected.type)(state) : [];
}
