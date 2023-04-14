import { Status } from '../../createGenericSlice';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { RootState } from '../../store';
import { selectFeilSlice } from '../feilmelding/feil-slice';
import {
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
    const feilMeldingsdata =
        selectAktivitetStatus(state) === Status.ERROR && selectFeilSlice(state)[hentAktivitet.rejected.type];
    return feilMeldingsdata;
};
export const selecteEndreAktivitetFeilmeldinger = (state: RootState) => {
    const aktivitetError = selectAktivitetStatus(state) === Status.ERROR;
    const oppdaterError = aktivitetError && selectFeilSlice(state)[oppdaterAktivitet.rejected.type];
    const oppdaterEtikettError = aktivitetError && selectFeilSlice(state)[oppdaterAktivitetEtikett.rejected.type];
    const oppdaterStillingFraNavError =
        aktivitetError && selectFeilSlice(state)[oppdaterStillingFraNavSoknadsstatus.rejected.type];
    return [oppdaterError, oppdaterEtikettError, oppdaterStillingFraNavError].filter((it) => it);
};

export function selectAktivitetFhoLestStatus(state: RootState) {
    return selectAktiviteterSlice(state).fhoLestStatus;
}

export function selectAktivitetFhoBekreftStatus(state: RootState) {
    return selectAktiviteterSlice(state).fhoBekreftStatus;
}
