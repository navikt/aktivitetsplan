import * as Api from './timeoutbox-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('auth');

export default reducer;

export function hentGjenstaendeInnloggetTid() {
    return action(() => Api.hentGjenstaendeInnloggetTid());
}
