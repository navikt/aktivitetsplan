import { datoErIPeriode } from '../filter/filter-utils';

export function selectHistoriskeVilkarReducer(state) {
    return state.data.historiskeVilkar;
}

export function selectAlleHistoriskeVilkar(state) {
    return selectHistoriskeVilkarReducer(state).data;
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
