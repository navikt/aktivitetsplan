export function selectMalverkSlice(state) {
    return state.data.malverk;
}

export function selectMalverkData(state) {
    return selectMalverkSlice(state).data;
}

export function selectMalverkMedTittel(state, tittel) {
    return selectMalverkData(state).filter((mal) => mal.tittel === tittel);
}

export function selectValgtMalverkSlice(state) {
    return selectMalverkSlice(state).valgtMalverk;
}

// eslint-disable-next-line import/prefer-default-export
export function selectMalverkStatus(state) {
    return selectMalverkSlice(state).status;
}
