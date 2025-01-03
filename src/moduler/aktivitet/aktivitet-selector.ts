import { SerializedError } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectErrors, selectFeil } from '../feilmelding/feil-selector';
import {
    flyttAktivitet,
    hentAktivitet,
    oppdaterAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterStillingFraNavSoknadsstatus,
} from './aktivitet-actions';
import { createSelector } from '@reduxjs/toolkit';
import { Historikk } from '../../datatypes/Historikk';
import { selectAktivitet, selectAktiviteterSlice } from './aktivitet-slice';

export function selectAktivitetStatus(state: RootState) {
    return selectAktiviteterSlice(state).status;
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

export const selectAktivitetHistorikk = createSelector(
    [selectAktivitet, (_, aktivitetId: string | undefined) => aktivitetId],
    (aktivitet, aktivitetId) => {
        if (!aktivitetId) return undefined;
        return (aktivitet as { historikk?: Historikk }).historikk;
    },
);
