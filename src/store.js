/* eslint-env browser */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import reducer from './reducer';

/* eslint-disable no-underscore-dangle */
function getStoreCompose(history) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return composeEnhancers(
        applyMiddleware(thunkMiddleware, routerMiddleware(history))
    );
}
/* eslint-enable */

export default function create(history) {
    return getStoreCompose(history)(createStore)(reducer, {});
}
