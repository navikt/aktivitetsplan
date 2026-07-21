import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import rootReducer, { RootState } from './rootReducer';
import { readWriteModeMiddleware } from '../utils/readOrWriteModeSlice';

export let storeRef: EnhancedStore | null = null;

const createStore = (preloadedState: RootState | undefined = undefined) => {
    const newStore = configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(readWriteModeMiddleware.middleware),
    });
    storeRef = newStore;
    return newStore;
};

type Store = ReturnType<typeof createStore>;

export type Dispatch = Store['dispatch'];

export default createStore;
