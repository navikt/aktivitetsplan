import { datoErIPeriode } from '../filtrering/filter/filter-utils';

function slice(state) {
    return state.data.historiskeVilkar;
}

export function selectHistoriskeVilkarStatus(state) {
    return slice(state).status;
}

export function selectAlleHistoriskeVilkar(state) {
    return slice(state).data;
}

export function selectHistoriskeVilkar(state) {
    return selectAlleHistoriskeVilkar(state).filter(historiskVilkar =>
        datoErIPeriode(historiskVilkar.dato, state)
    );
}

export function selectHistoriskVilkarMedGuid(state, key) {
    return selectAlleHistoriskeVilkar(state).find(
        historiskVilkar => historiskVilkar.guid === key
    );
}
