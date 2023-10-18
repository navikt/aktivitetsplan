import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectErrors, selectFeil } from '../feilmelding/feil-selector';
import { hentNivaa4 } from './tilgang-slice';
import { createSelector } from 'reselect';

function selectTilgangSlice(state: RootState) {
    return state.data.tilgang;
}

function selectTilgangData(state: RootState) {
    return selectTilgangSlice(state).data;
}

export function selectNivaa4(state: RootState) {
    const tilgangData = selectTilgangData(state);
    return tilgangData ? tilgangData.harbruktnivaa4 : false;
}

export function selectNivaa4LastetOk(state: RootState) {
    return selectNivaa4Status(state) === Status.OK;
}

export function selectNivaa4Status(state: RootState) {
    return selectTilgangSlice(state).status;
}

export const selectNivaa4Feilmeldinger: (state: RootState) => void = createSelector(
    selectTilgangSlice,
    selectErrors,
    (tilgangSlice, errors) => {
        return tilgangSlice.status === Status.ERROR ? selectFeil(errors, hentNivaa4.rejected.type) : [];
    },
);
