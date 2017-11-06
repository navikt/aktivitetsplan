import {dateToISODate, sammenlignDato} from '../../utils';

export function selectOppfolgingSlice(state) {
    return state.data.oppfolging;
}

function selectOppfolgingData(state) {
    return selectOppfolgingSlice(state).data;
}

export function selectOppfolgingStatus(state) {
    return selectOppfolgingSlice(state).status;
}
export const selectReservasjonKRR = state =>
    selectOppfolgingData(state).reservasjonKRR;

export function selectOppfolgingsPerioder(state) {
    return selectOppfolgingData(state).oppfolgingsPerioder || [];
}

export function selectHistoriskeOppfolgingsPerioder(state) {
    return selectOppfolgingsPerioder(state).filter(p => p.sluttDato);
}

export function selectSorterteHistoriskeOppfolgingsPerioder(state) {
    let nesteFra = dateToISODate(new Date(0));
    return selectHistoriskeOppfolgingsPerioder(state)
        .sort(sammenlignDato)
        .map(periode => {
            const sluttDato = periode.sluttDato;
            const fra = nesteFra;
            nesteFra = sluttDato;
            return {
                id: sluttDato,
                fra,
                til: sluttDato,
                vistFra: periode.startDato,
            };
        });
}

export function selectErUnderOppfolging(state) {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectOppfolgingUtgang(state) {
    return selectOppfolgingData(state).oppfolgingUtgang;
}

export function selectErBrukerManuell(state) {
    return selectOppfolgingData(state).manuell;
}

export function selectVilkarMaBesvares(state) {
    return selectOppfolgingData(state).vilkarMaBesvares;
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

export function selectAvslutningStatus(state) {
    return selectOppfolgingData(state).avslutningStatus;
}

export function selectUnderOppfolging(state) {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectBrukerHarAvslatt(state) {
    return selectOppfolgingSlice(state).brukerHarAvslatt;
}

export function selectKanIkkeStartaEskaleringen(state) {
    return (
        selectErEskalert(state) ||
        !selectErUnderOppfolging(state) ||
        selectReservasjonKRR(state) ||
        selectErBrukerManuell(state)
    );
}
