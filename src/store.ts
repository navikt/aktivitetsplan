import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';
import { EnhancedStore } from '@reduxjs/toolkit/src/configureStore';

let store: EnhancedStore | null = null;
const createStore = (preloadedState: any = undefined) => {
    const newStore = configureStore({
        reducer: reducer,
        preloadedState,
    });
    store = newStore;
    return newStore;
};

type Store = ReturnType<typeof createStore>;

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

export type RootState = ReturnType<Store['getState']>;
export type Dispatch = Store['dispatch'];

export default createStore;
