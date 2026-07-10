import { createSelector } from '@reduxjs/toolkit';
import { compareDesc } from 'date-fns';

import { RootState } from '../../store';
import { selectAktiviteterSlice, selectAllOppfolgingsperioder } from '../aktivitet/aktivitet-slice';
import { selectValgtPeriodeId } from '../filtrering/filter/valgt-periode-slice';
import { OppfolgingsPeriodeId } from '../../datatypes/brandedTypes';

export function selectOppfolgingSlice(state: RootState) {
    return state.data.oppfolging;
}

function selectOppfolgingData(state: RootState) {
    return selectOppfolgingSlice(state).data;
}

export function selectOppfolgingStatus(state: RootState) {
    return selectOppfolgingSlice(state).status;
}

export const selectReservasjonKRR = (state: RootState) =>
    selectOppfolgingData(state)?.brukerStatus?.krr?.reservertIKrr || false;
export const selectKanVarsles = (state: RootState) =>
    selectOppfolgingData(state)?.brukerStatus?.krr?.kanVarsles || false;
export const selectErRegisrertIKRR = (state: RootState) =>
    selectOppfolgingData(state)?.brukerStatus?.krr?.registrertIKrr;

export const selectOppfolgingsPerioderMedKvpPerioder = createSelector(selectOppfolgingData, (oppfolgingsStatus) => {
    return oppfolgingsStatus?.oppfolgingsperioder || [];
});

export function selectAktivOppfolgingsperiode(state: RootState) {
    return selectOppfolgingsPerioder(state).find((oppfolgingsperiode) => !oppfolgingsperiode.slutt);
}

export interface MinimalPeriode {
    id: OppfolgingsPeriodeId;
    start: string;
    slutt: string | null | undefined;
}
export const selectOppfolgingsPerioder: (store: RootState) => MinimalPeriode[] = createSelector(
    selectAktiviteterSlice,
    (state) => {
        return selectAllOppfolgingsperioder(state).map((periode) => ({
            id: periode.id,
            start: periode.start,
            slutt: periode.slutt,
        }));
    },
);

export const selectSorterteOppfolgingsperioder = createSelector(selectOppfolgingsPerioder, (perioder) => {
    return Array.from(perioder).sort((a, b) => {
        return compareDesc(a.start, b.start);
    });
});

// TODO refaktorer, må fikse typer oppfolgingsperioder-typene i hele appen
export function selectKvpPeriodeForValgteOppfolging(state: RootState) {
    const valgtOppfolgingId = selectValgtPeriodeId(state);
    const perioderMedKvpPerioder = selectOppfolgingsPerioderMedKvpPerioder(state);
    console.log({ perioderMedKvpPerioder });
    console.log({ valgtOppfolgingId });
    const oppfolging = perioderMedKvpPerioder.find(
        (periodeMedKvpPerioder) => periodeMedKvpPerioder.id == valgtOppfolgingId,
    );
    return oppfolging && oppfolging.kvpPerioder;
}

export const selectValgtPeriode = createSelector(
    selectValgtPeriodeId,
    selectOppfolgingsPerioder,
    (valgtPeriodeId, perioder) => {
        return perioder.find((periode) => periode.id === valgtPeriodeId);
    },
);

export const selectViserHistoriskPeriode: (state: RootState) => boolean = createSelector(
    selectValgtPeriode,
    (valgtPeriode) => {
        return !!valgtPeriode?.slutt;
    },
);

export const selectViserAktivPeriode: (state: RootState) => boolean = createSelector(
    selectViserHistoriskPeriode,
    (viserHistoriskPeriode) => {
        return !viserHistoriskPeriode;
    },
);

export function selectErUnderOppfolging(state: RootState): boolean {
    return selectOppfolgingData(state)?.oppfolging?.erUnderOppfolging || false;
}

export function selectErBrukerManuell(state: RootState) {
    return selectOppfolgingData(state)?.brukerStatus?.manuell?.erManuell || false;
}

export function selectErUnderKvp(state: RootState) {
    const nåværendeKvpPeriode = selectOppfolgingData(state)
        ?.oppfolgingsperioder?.find((it) => !it.sluttTidspunkt)
        ?.kvpPerioder?.find((kvpPeriode) => !kvpPeriode.sluttTidspunkt);
    return !!nåværendeKvpPeriode;
}

export function selectKanReaktiveres(state: RootState) {
    return selectOppfolgingData(state)?.brukerStatus?.arena?.kanReaktiveres;
}

export function selectInaktiveringsDato(state: RootState) {
    return selectOppfolgingData(state)?.brukerStatus?.arena?.inaktiveringsdato;
}
