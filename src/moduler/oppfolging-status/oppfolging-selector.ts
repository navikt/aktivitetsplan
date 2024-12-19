import { createSelector } from 'reselect';
import { compareDesc } from 'date-fns';

import { HistoriskOppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';
import { selectAktiviteterSlice, selectAllOppfolgingsperioder } from '../aktivitet/aktivitet-slice';
import { selectValgtPeriodeId } from '../filtrering/filter/valgt-periode-slice';

export function selectOppfolgingSlice(state: RootState) {
    return state.data.oppfolging;
}

function selectOppfolgingData(state: RootState) {
    return selectOppfolgingSlice(state).data;
}

export function selectOppfolgingStatus(state: RootState) {
    return selectOppfolgingSlice(state).status;
}

export const selectReservasjonKRR = (state: RootState) => selectOppfolgingData(state)?.reservasjonKRR;

export function selectServicegruppe(state: RootState) {
    return selectOppfolgingData(state)?.servicegruppe;
}

export const selectOppfolgingsPerioderMedKvpPerioder = createSelector(selectOppfolgingData, (oppfolgingsStatus) => {
    return oppfolgingsStatus?.oppfolgingsPerioder || [];
});

export function selectAktivOppfolgingsperiode(state: RootState) {
    return selectOppfolgingsPerioder(state).find((oppfolgingsperiode) => !oppfolgingsperiode.slutt);
}

export interface MinimalPeriode {
    id: string;
    start: string;
    slutt: string | undefined;
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

export const selectForrigeHistoriskeSluttDato: (store: RootState) => string | undefined = createSelector(
    selectOppfolgingsPerioder,
    (perioder) =>
        perioder
            .filter((periode) => periode.slutt !== undefined)
            .map((periode) => periode.slutt)
            .sort()
            .reverse()[0],
);

export type VistOppfolgingsPeriode = HistoriskOppfolgingsperiode & { fra: string; til: string };
export const selectSorterteOppfolgingsperioder = createSelector(selectOppfolgingsPerioder, (perioder) => {
    return perioder.toSorted((a, b) => {
        return compareDesc(a.start, b.start);
    });
});

// TODO refaktorer, må fikse typer oppfolgingsperioder-typene i hele appen
export function selectKvpPeriodeForValgteOppfolging(state: RootState) {
    const valgtOppfolgingId = selectValgtPeriodeId(state);
    const perioderMedKvpPerioder = selectOppfolgingsPerioderMedKvpPerioder(state);
    const oppfolging = perioderMedKvpPerioder.find(
        (periodeMedKvpPerioder) => periodeMedKvpPerioder.uuid === valgtOppfolgingId,
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
    return selectOppfolgingData(state)?.underOppfolging || false;
}

export function selectErBrukerManuell(state: RootState) {
    return selectOppfolgingData(state)?.manuell;
}

export function selectAktorId(state: RootState) {
    return selectOppfolgingData(state)?.aktorId;
}

export function selectErUnderKvp(state: RootState) {
    return selectOppfolgingData(state)?.underKvp;
}

export function selectHarSkriveTilgang(state: RootState) {
    return selectOppfolgingData(state)?.harSkriveTilgang || false;
}

export function selectKanReaktiveres(state: RootState) {
    return selectOppfolgingData(state)?.kanReaktiveres;
}

export function selectInaktiveringsDato(state: RootState) {
    return selectOppfolgingData(state)?.inaktiveringsdato;
}
