/* eslint-env browser */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import freeze from 'redux-freeze';
import { routerMiddleware } from 'react-router-redux';
import reducer from './reducer';

/* eslint-disable no-underscore-dangle */
function getStoreCompose(history) {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return composeEnhancers(
        applyMiddleware(thunkMiddleware, routerMiddleware(history), freeze)
    );
}
/* eslint-enable */

export default function create(history) {
    return getStoreCompose(history)(createStore)(reducer, {});
}
