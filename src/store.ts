/* eslint-env browser */
import { applyMiddleware, compose, createStore } from 'redux';
import freeze from 'redux-freeze';
import thunkMiddleware from 'redux-thunk';

import reducer, { State } from './reducer';

declare const window: {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
};

/* eslint-disable no-underscore-dangle */
function getStoreCompose() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return composeEnhancers(applyMiddleware(thunkMiddleware, freeze));
}
/* eslint-enable */

export default function create(preloadedState: State = {} as State) {
    return getStoreCompose()(createStore)(reducer, preloadedState);
}
