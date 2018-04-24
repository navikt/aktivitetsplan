import * as Api from './oppfoelgingsstatus-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer('oppfoelgingsstatus');

export default reducer;

export function hentOppfolgingsstatus(fnr) {
    return cashedAction(() => Api.hentOppfolgingsstatus(fnr));
}
