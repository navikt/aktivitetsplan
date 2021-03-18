import * as Api from '../../api/personAPI';
import { createActionsAndReducer } from '../../felles-komponenter/utils/createActionsAndReducer';

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
