import { configureStore } from '@reduxjs/toolkit';

import reducer, { RootState, stateWithFnr } from './reducer';
import { EnhancedStore } from '@reduxjs/toolkit/src/configureStore';

let store: EnhancedStore | null = null;
const createStore = (preloadedState: any = undefined, fnr: string | undefined) => {
    const newStore = configureStore({
        reducer: reducer,
        preloadedState: stateWithFnr(preloadedState, fnr),
    });
    store = newStore;
    return newStore;
};

const key = 'aktivitetsplan-state';
export const getPreloadedStateFromSessionStorage = (fnr: string | undefined): RootState | undefined => {
    if (!fnr) return undefined;
    const serializedState = sessionStorage.getItem(key);
    if (serializedState) {
        try {
            const state: RootState = JSON.parse(serializedState);
            // Only use cache if correct user
            if (fnr === state.data.oppfolging?.data?.fnr) {
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
    const state = store?.getState();
    sessionStorage.setItem(key, JSON.stringify(state));
};
export const clearReduxCache = () => sessionStorage.removeItem(key);

export type Dispatch = ReturnType<typeof createStore>['dispatch'];

export default createStore;
