/* eslint-env browser */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import freeze from 'redux-freeze';
import reducer from './reducer';

/* eslint-disable no-underscore-dangle */
function getStoreCompose() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return composeEnhancers(applyMiddleware(thunkMiddleware, freeze));
}
/* eslint-enable */

export default function create() {
    return getStoreCompose()(createStore)(reducer, {});
}
