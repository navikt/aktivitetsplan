import { createActionsAndReducer } from '../../ducks/rest-reducer';
import * as Api from '../motpart/motpart-api';

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
