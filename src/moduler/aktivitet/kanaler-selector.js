function selectKanalerSlice(state) {
    return state.data.kanaler;
}

export function selectKanalerStatus(state) {
    return selectKanalerSlice(state).status;
}

export function selectKanalerData(state) {
    return selectKanalerSlice(state).data;
}
