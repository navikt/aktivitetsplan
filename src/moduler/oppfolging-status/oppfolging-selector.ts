import { Status } from '../../createGenericSlice';
import { HistoriskOppfolgingsperiode, Oppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { selectHistoriskeOppfolgingsPerioder } from './oppfolging-selectorts';

type State = any;

export function selectOppfolgingSlice(state: State) {
    return state.data.oppfolging;
}

function selectOppfolgingData(state: State) {
    return selectOppfolgingSlice(state).data;
}

export function selectOppfolgingStatus(state: State) {
    return selectOppfolgingSlice(state).status;
}

export const selectReservasjonKRR = (state: State) => selectOppfolgingData(state).reservasjonKRR;

export function selectServicegruppe(state: State) {
    return selectOppfolgingData(state).servicegruppe;
}

export function selectOppfolgingsPerioder(state: State): Oppfolgingsperiode[] {
    return selectOppfolgingData(state).oppfolgingsPerioder || [];
}

export type VistOppfolgingsPeriode = HistoriskOppfolgingsperiode & { fra: string; til: string };
export function selectSorterteHistoriskeOppfolgingsPerioder(state: State): VistOppfolgingsPeriode[] {
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

export function selectKvpPeriodeForValgteOppfolging(state: State) {
    const valgtOppfolging: HistoriskOppfolgingsperiode = state.data.filter.historiskPeriode;
    const valgtOppfolgingId = valgtOppfolging && valgtOppfolging.uuid;
    const oppfolging = selectOppfolgingsPerioder(state).find((p) => p.uuid === valgtOppfolgingId);
    return oppfolging && oppfolging.kvpPerioder;
}

export function selectErUnderOppfolging(state: State): boolean {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectErBrukerManuell(state: State) {
    return selectOppfolgingData(state).manuell;
}

export function selectAktorId(state: State) {
    return selectOppfolgingData(state).aktorId;
}

export function selectUnderOppfolging(state: State) {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectErUnderKvp(state: State) {
    return selectOppfolgingData(state).underKvp;
}

export function selectHarSkriveTilgang(state: State) {
    return selectOppfolgingData(state).harSkriveTilgang;
}

export function selectKanReaktiveres(state: State) {
    return selectOppfolgingData(state).kanReaktiveres;
}

export function selectInaktiveringsDato(state: State) {
    return selectOppfolgingData(state).inaktiveringsdato;
}

export function selectOppfolgingFeilmeldinger(state: State) {
    const feilMeldingsdata = selectOppfolgingStatus(state) === Status.ERROR && selectOppfolgingSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
}
