/* eslint-env browser */
import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import DevTools from './devtools';
import reducer from './reducer';
import { erDev } from './utils';
import freeze from 'redux-freeze';

function getDebugSessionKey() {
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length > 0) ? matches[1] : null;
}

function getDevStoreCompose(history) {
    return compose(
        applyMiddleware(thunkMiddleware, routerMiddleware(history), freeze),
        DevTools.instrument(),
        persistState(getDebugSessionKey())
    );
}

function getStoreCompose(history) {
    return compose(
        applyMiddleware(thunkMiddleware, routerMiddleware(history))
    );
}

export default function create(history) {
    const composed = erDev() ? getDevStoreCompose(history) : getStoreCompose(history);

    return composed(createStore)(reducer, {});
}
