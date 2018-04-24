export function selectOppfoelgingsstatusSlice(state) {
    return state.data.oppfoelgingsstatus;
}

export function selectOppfoelgingsstatusStatus(state) {
    return selectOppfoelgingsstatusSlice(state).status;
}

export function selectOppfoelgingsstatusData(state) {
    return selectOppfoelgingsstatusSlice(state).data;
}
