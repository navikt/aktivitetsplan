import { SerializedError } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { RootState } from '../../store';
import { exist } from '../../utils/utils';
import { selectFeilSlice } from '../feilmelding/feil-selector';
import {
    flyttAktivitet,
    hentAktivitet,
    lagNyAktivitet,
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

export const selectAktivitetFeilmeldinger = (state: RootState): SerializedError | undefined => {
    return selectAktivitetStatus(state) === Status.ERROR
        ? selectFeilSlice(state)[hentAktivitet.rejected.type]
        : undefined;
};
export const selectOpprettAktivitetFeilmeldinger = (state: RootState): SerializedError | undefined => {
    return selectAktivitetStatus(state) === Status.ERROR
        ? selectFeilSlice(state)[lagNyAktivitet.rejected.type]
        : undefined;
};
export const selecteEndreAktivitetFeilmeldinger = (state: RootState): SerializedError[] => {
    const oppdaterError = selectFeilSlice(state)[oppdaterAktivitet.rejected.type];
    const oppdaterEtikettError = selectFeilSlice(state)[oppdaterAktivitetEtikett.rejected.type];
    const oppdaterStillingFraNavError = selectFeilSlice(state)[oppdaterStillingFraNavSoknadsstatus.rejected.type];
    const flyttAktivitetError = selectFeilSlice(state)[flyttAktivitet.rejected.type];
    return [oppdaterError, oppdaterEtikettError, oppdaterStillingFraNavError, flyttAktivitetError].filter(exist);
};

export function selectAktivitetFhoBekreftStatus(state: RootState) {
    return selectAktiviteterSlice(state).fhoBekreftStatus;
}
