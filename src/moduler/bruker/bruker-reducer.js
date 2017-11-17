import * as Api from '../motpart/motpart-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action, actionTypes } = createActionsAndReducer('bruker');

export default reducer;

export function hentBruker(fnr) {
    return action(() => Api.hentPerson(fnr));
}

export function setStatusOk() {
    return {
        type: actionTypes.OK,
    };
}
