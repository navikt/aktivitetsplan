import { storeRef } from './store';
import type { RootState } from './rootReducer';

const key = 'aktivitetsplan-state';
const fnrKey = 'aktivitetsplan-state-fnr';

export const getPreloadedStateFromSessionStorage = (fnr: string | undefined): RootState | undefined => {
    if (!fnr) return undefined;
    const serializedState = sessionStorage.getItem(key);
    if (serializedState) {
        try {
            const cachedFnr = sessionStorage.getItem(fnrKey);
            // Only use cache if correct user
            if (fnr === cachedFnr) {
                return JSON.parse(serializedState);
            }
            sessionStorage.removeItem(key);
            return undefined;
        } catch (e) {
            console.warn(e);
            return undefined;
        }
    }
    return undefined;
};

export const saveReduxStateToSessionStorage = () => {
    const state = storeRef?.getState();
    sessionStorage.setItem(key, JSON.stringify(state));
    const fnr = sessionStorage.getItem('aktivitetsplan_fnr');
    if (fnr) sessionStorage.setItem(fnrKey, fnr);
};

export const clearReduxCache = () => {
    sessionStorage.removeItem(key);
    sessionStorage.removeItem(fnrKey);
};
