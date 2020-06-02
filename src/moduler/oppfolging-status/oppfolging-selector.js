import { createSelector } from 'reselect';
import { getNowAsISODate } from '../../utils';
import { STATUS } from '../../ducks/utils';

export function selectOppfolgingSlice(state) {
    return state.data.oppfolging;
}

function selectOppfolgingData(state) {
    return selectOppfolgingSlice(state).data;
}

export function selectOppfolgingStatus(state) {
    return selectOppfolgingSlice(state).status;
}
export const selectReservasjonKRR = (state) => selectOppfolgingData(state).reservasjonKRR;

export function selectServicegruppe(state) {
    return selectOppfolgingData(state).servicegruppe;
}

export function selectOppfolgingsPerioder(state) {
    return selectOppfolgingData(state).oppfolgingsPerioder || [];
}

export const selectHistoriskeOppfolgingsPerioder = createSelector(selectOppfolgingsPerioder, (oppfolgingsPerioder) =>
    oppfolgingsPerioder.filter((p) => p.sluttDato)
);

export const selectForrigeHistoriskeSluttDato = createSelector(
    selectHistoriskeOppfolgingsPerioder,
    (historiskeOppfolgingsPerioder) =>
        (historiskeOppfolgingsPerioder || [])
            .map((p) => p.sluttDato)
            .sort()
            .reverse()[0]
);

export function selectSorterteHistoriskeOppfolgingsPerioder(state) {
    let nesteFra = getNowAsISODate();
    return selectHistoriskeOppfolgingsPerioder(state)
        .sort((a, b) => a.sluttDato.localeCompare(b.sluttDato))
        .map((periode) => {
            const { sluttDato } = periode;
            const fra = nesteFra;
            nesteFra = sluttDato;
            return {
                id: sluttDato,
                fra,
                til: sluttDato,
                vistFra: periode.startDato,
            };
        })
        .reverse();
}

export function selectKvpPeriodeForValgteOppfolging(state) {
    const valgtOppfolging = state.data.filter.historiskPeriode;
    const valgtOppfolgingId = valgtOppfolging && valgtOppfolging.id;
    const oppfolging = selectOppfolgingsPerioder(state).find((p) => p.sluttDato === valgtOppfolgingId);
    return oppfolging && oppfolging.kvpPerioder;
}

export function selectErUnderOppfolging(state) {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectErBrukerManuell(state) {
    return selectOppfolgingData(state).manuell;
}

export function selectAktorId(state) {
    return selectOppfolgingData(state).aktorId;
}

export function selectGjeldendeEskaleringsVarsel(state) {
    return selectOppfolgingData(state).gjeldendeEskaleringsvarsel;
}

export function selectErEskalert(state) {
    return !!selectGjeldendeEskaleringsVarsel(state);
}

export function selectTilHorendeDialogId(state) {
    if (selectGjeldendeEskaleringsVarsel(state)) {
        return selectGjeldendeEskaleringsVarsel(state).tilhorendeDialogId;
    }
    return null;
}

export function selectUnderOppfolging(state) {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectErUnderKvp(state) {
    return selectOppfolgingData(state).underKvp;
}

export function selectHarSkriveTilgang(state) {
    return selectOppfolgingData(state).harSkriveTilgang;
}

export function selectKanReaktiveres(state) {
    return selectOppfolgingData(state).kanReaktiveres;
}

export function selectInaktiveringsDato(state) {
    return selectOppfolgingData(state).inaktiveringsdato;
}

export function selectOppfolgingFeilmeldinger(state) {
    const feilMeldingsdata = selectOppfolgingStatus(state) === STATUS.ERROR && selectOppfolgingSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
}
