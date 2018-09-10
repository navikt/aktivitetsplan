export function selectOppfoelgingsstatusSlice(state) {
    return state.data.oppfoelgingsstatus;
}

export function selectOppfoelgingsstatusStatus(state) {
    return selectOppfoelgingsstatusSlice(state).status;
}

export function selectOppfoelgingsstatusData(state) {
    return selectOppfoelgingsstatusSlice(state).data;
}

export function selectFormidlingsgruppe(state) {
    return selectOppfoelgingsstatusData(state).formidlingsgruppe;
}

export function selectErBrukerInaktivIArena(state) {
    return selectFormidlingsgruppe(state) === 'ISERV';
}

export function selectErBrukerAktivIArena(state) {
    return !selectErBrukerInaktivIArena(state);
}
