import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';
import { EnhancedStore } from '@reduxjs/toolkit/src/configureStore';

type Store = ReturnType<typeof createStore>;

let store: EnhancedStore | null = null;
const createStore = (preloadedState: any = undefined): EnhancedStore => {
    const newStore: EnhancedStore = configureStore({
        reducer: reducer,
        preloadedState,
    });
    store = newStore;
    return newStore;
};

const key = 'aktivitetsplan-state';
export const getPreloadedStoreFromSessionStorage = (): Store | undefined => {
    const serializedState = sessionStorage.getItem(key);
    if (serializedState) {
        try {
            console.log('Cache hit');
            return JSON.parse(serializedState);
        } catch (e) {
            console.warn(e);
            return undefined;
        }
    }
    return undefined;
};
export const saveReduxStateToSessionStorage = () => {
    const state = JSON.stringify(store?.getState());
    sessionStorage.setItem(key, JSON.stringify(state));
};

export type RootState = ReturnType<Store['getState']>;
export type Dispatch = Store['dispatch'];

export default createStore;
