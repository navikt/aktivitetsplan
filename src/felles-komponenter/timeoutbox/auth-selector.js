export function selectAuthSlice(state) {
    return state.data.auth;
}

export function selectRemainingSeconds(state) {
    return selectAuthSlice(state).data.remainingSeconds;
}

export function selectAuthStatus(state) {
    return selectAuthSlice(state).status;
}
