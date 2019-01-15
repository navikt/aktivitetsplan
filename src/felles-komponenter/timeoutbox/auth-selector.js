export function selectAuthSlice(state) {
    return state.data.auth;
}

export function selectExpirationTime(state) {
    return selectAuthSlice(state).data.expirationTime;
}
