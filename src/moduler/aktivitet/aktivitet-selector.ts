import { SerializedError } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { RootState } from '../../store';
import { selectFeil } from '../feilmelding/feil-selector';
import {
    flyttAktivitet,
    hentAktivitet,
    oppdaterAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterStillingFraNavSoknadsstatus,
} from './aktivitet-actions';
import { AktivitetState } from './aktivitet-slice';

export function selectAktiviteterSlice(state: RootState): AktivitetState {
    return state.data.aktiviteter;
}

export function selectAktiviteterData(state: RootState): VeilarbAktivitet[] {
    // TODO: Find out why this returns [undefined] in one of the tests
    return selectAktiviteterSlice(state).data.filter((it) => it) || [];
}

export function selectAktivitetStatus(state: RootState) {
    return selectAktiviteterSlice(state).status;
}

export function selectHarTilgangTilAktiviteter(state: RootState) {
    return selectAktivitetStatus(state) === Status.OK;
}

export function selectLasterAktivitetData(state: RootState) {
    return selectAktivitetStatus(state) !== Status.OK;
}

export const selectAktivitetFeilmeldinger = (state: RootState) => {
    return selectAktivitetStatus(state) === Status.ERROR ? selectFeil(hentAktivitet.rejected.type)(state) : [];
};

export const selecteEndreAktivitetFeilmeldinger = (state: RootState): SerializedError[] => {
    const oppdaterError = selectFeil(oppdaterAktivitet.rejected.type)(state);
    const oppdaterEtikettError = selectFeil(oppdaterAktivitetEtikett.rejected.type)(state);
    const oppdaterStillingFraNavError = selectFeil(oppdaterStillingFraNavSoknadsstatus.rejected.type)(state);
    const flyttAktivitetError = selectFeil(flyttAktivitet.rejected.type)(state);
    return [...oppdaterError, ...oppdaterEtikettError, ...oppdaterStillingFraNavError, ...flyttAktivitetError];
};
