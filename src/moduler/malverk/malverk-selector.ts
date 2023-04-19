import { RootState } from '../../store';

export function selectMalverkSlice(state: RootState) {
    return state.data.malverk;
}

export function selectMalverkData(state: RootState) {
    return selectMalverkSlice(state).malverker;
}

export function selectMalverkMedTittel(state: RootState, tittel: string) {
    return selectMalverkData(state).filter((mal) => mal.tittel === tittel);
}

export function selectMalverkStatus(state: RootState) {
    return selectMalverkSlice(state).status;
}
