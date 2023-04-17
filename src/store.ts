import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';

const createStore = () =>
    configureStore({
        reducer: reducer,
    });

type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store['getState']>;
export type Dispatch = Store['dispatch'];

export default createStore;
