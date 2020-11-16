import { createActionsAndReducer } from '../../ducks/rest-reducer';
import * as Api from '../motpart/motpart-api';

const { reducer, cashedAction, actionTypes } = createActionsAndReducer('bruker');

export default reducer;

export function hentBruker(fnr) {
    return cashedAction(() => Api.hentPerson(fnr));
}

export function setStatusOk() {
    return {
        type: actionTypes.OK,
    };
}
