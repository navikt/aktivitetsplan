function selectFeatureSlice(state) {
    return state.data.feature;
}

export function selectFeatureData(state) {
    return selectFeatureSlice(state).data;
}

export function selectFeatureStatus(state) {
    return selectFeatureSlice(state).status;
}
