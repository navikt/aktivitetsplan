import { SerializedError } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { selectErrors, selectFeil } from '../feilmelding/feil-selector';
import {
    flyttAktivitet,
    hentAktivitet,
    oppdaterAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterStillingFraNavSoknadsstatus,
} from './aktivitet-actions';
import { AktivitetState } from './aktivitet-slice';
import { createSelector } from 'reselect';
import { RootState } from '../../reducer';

export function selectAktiviteterSlice(state: RootState): AktivitetState {
    return state.data.aktiviteter;
}

export const selectAktiviteterData: (state: RootState) => VeilarbAktivitet[] = createSelector(
    selectAktiviteterSlice,
    (aktiviteter) => {
        // TODO: Find out why this returns [undefined] in one of the tests
        return aktiviteter.data.perioder.flatMap((periode) => periode.aktiviteter).filter((it) => it) || [];
    },
);
export const selectAktiviteterByPeriode = (state: RootState) => {
    return selectAktiviteterSlice(state).data.perioder || [];
};

export function selectAktivitetStatus(state: RootState) {
    return selectAktiviteterSlice(state).status;
}

export function selectHarTilgangTilAktiviteter(state: RootState) {
    return selectAktivitetStatus(state) === Status.OK;
}

export function selectLasterAktivitetData(state: RootState) {
    return selectAktivitetStatus(state) !== Status.OK;
}

export const selectAktivitetFeilmeldinger = createSelector(
    selectAktivitetStatus,
    selectErrors,
    (aktiviteterStatus, errors) => {
        return aktiviteterStatus === Status.ERROR ? selectFeil(errors, hentAktivitet.rejected.type) : [];
    },
);

export const selecteEndreAktivitetFeilmeldinger: (state: RootState) => SerializedError[] = createSelector(
    selectErrors,
    (errors) => {
        const oppdaterError = selectFeil(errors, oppdaterAktivitet.rejected.type);
        const oppdaterEtikettError = selectFeil(errors, oppdaterAktivitetEtikett.rejected.type);
        const oppdaterStillingFraNavError = selectFeil(errors, oppdaterStillingFraNavSoknadsstatus.rejected.type);
        const flyttAktivitetError = selectFeil(errors, flyttAktivitet.rejected.type);
        return [...oppdaterError, ...oppdaterEtikettError, ...oppdaterStillingFraNavError, ...flyttAktivitetError];
    },
);
