function selectReferatSlice(state) {
    return state.data.referat;
}

// eslint-disable-next-line import/prefer-default-export
export function selectReferatStatus(state) {
    return selectReferatSlice(state).status;
}
