import { createSelector } from 'reselect';

import { HistoriskOppfolgingsperiode, Oppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';

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

export function selectOppfolgingsPerioder(state: RootState): Oppfolgingsperiode[] {
    return selectOppfolgingData(state)?.oppfolgingsPerioder || [];
}

export type VistOppfolgingsPeriode = HistoriskOppfolgingsperiode & { fra: string; til: string };
export function selectSorterteHistoriskeOppfolgingsPerioder(state: RootState): VistOppfolgingsPeriode[] {
    let nesteFra = new Date().toISOString();
    return selectHistoriskeOppfolgingsPerioder(state)
        .sort((a, b) => a.sluttDato.localeCompare(b.sluttDato))
        .map((periode) => {
            const { sluttDato } = periode;
            const fra = nesteFra;
            nesteFra = sluttDato;
            return {
                ...periode,
                fra,
                til: sluttDato,
            };
        })
        .reverse();
}

export function selectKvpPeriodeForValgteOppfolging(state: RootState) {
    const valgtOppfolging: HistoriskOppfolgingsperiode | null = state.data.filter.historiskPeriode;
    const valgtOppfolgingId = valgtOppfolging && valgtOppfolging.uuid;
    const oppfolging = selectOppfolgingsPerioder(state).find((p) => p.uuid === valgtOppfolgingId);
    return oppfolging && oppfolging.kvpPerioder;
}

export function selectErUnderOppfolging(state: RootState): boolean {
    return selectOppfolgingData(state)?.underOppfolging || false;
}

export function selectErBrukerManuell(state: RootState) {
    return selectOppfolgingData(state)?.manuell;
}

export function selectAktorId(state: RootState) {
    return selectOppfolgingData(state)?.aktorId;
}

export function selectUnderOppfolging(state: RootState) {
    return selectOppfolgingData(state)?.underOppfolging;
}

export function selectErUnderKvp(state: RootState) {
    return selectOppfolgingData(state)?.underKvp;
}

export function selectHarSkriveTilgang(state: RootState) {
    return selectOppfolgingData(state)?.harSkriveTilgang;
}

export function selectKanReaktiveres(state: RootState) {
    return selectOppfolgingData(state)?.kanReaktiveres;
}

export function selectInaktiveringsDato(state: RootState) {
    return selectOppfolgingData(state)?.inaktiveringsdato;
}

export const selectHistoriskeOppfolgingsPerioder: (state: RootState) => HistoriskOppfolgingsperiode[] = createSelector(
    selectOppfolgingsPerioder,
    (oppfolgingsPerioder: Oppfolgingsperiode[]) =>
        oppfolgingsPerioder.filter((p) => p.sluttDato) as HistoriskOppfolgingsperiode[]
);

export const selectForrigeHistoriskeSluttDato: (store: RootState) => string | undefined = createSelector(
    selectHistoriskeOppfolgingsPerioder,
    (historiskeOppfolgingsPerioder: HistoriskOppfolgingsperiode[]) =>
        historiskeOppfolgingsPerioder
            .map((p) => p.sluttDato)
            .sort()
            .reverse()[0]
);
