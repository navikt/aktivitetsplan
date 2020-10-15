import * as Api from '../motpart/motpart-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, cashedAction, actionTypes } = createActionsAndReducer('tilgang');

export default reducer;

export function hentNivaa4(fnr) {
    return cashedAction(() => Api.hentHarNivaa4(fnr));
}

export function setStatusOk() {
    return {
        type: actionTypes.OK,
    };
}
