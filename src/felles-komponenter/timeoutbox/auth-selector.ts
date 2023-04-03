import { RootState } from '../../store';

function selectAuthSlice(state: RootState) {
    return state.data.auth;
}

function selectAuthSliceData(state: RootState) {
    return selectAuthSlice(state).data;
}

export function selectExpirationTime(state: RootState) {
    return selectAuthSliceData(state)?.expirationTime;
}
