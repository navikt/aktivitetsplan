import * as Api from './siste-innlogging-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action, selectData } = createActionsAndReducer(
    'sisteInnlogging'
);

export function hentSisteInnlogging() {
    return action(Api.hentSisteInnlogging);
}

export function selectSisteInnlogging(state) {
    return selectData(state);
}

export { reducer };
