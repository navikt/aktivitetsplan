import { configureStore } from '@reduxjs/toolkit';

/* eslint-env browser */
import reducer, { State } from './reducer';

/* eslint-disable no-underscore-dangle */
/* eslint-enable */
export default function create(preloadedState: State | undefined = undefined) {
    return configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
        // preloadedState,
    });
}
