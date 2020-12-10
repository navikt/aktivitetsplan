import * as Api from '../../api/motpartAPI';
import { createActionsAndReducer } from '../../felles-komponenter/utils/createActionsAndReducer';

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
