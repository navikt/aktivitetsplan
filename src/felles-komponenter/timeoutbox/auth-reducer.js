import { createActionsAndReducer } from '../../ducks/rest-reducer';
import * as Api from './timeoutbox-api';

const { reducer, action } = createActionsAndReducer('auth');

export default reducer;

export function hentGjenstaendeInnloggetTid() {
    return action(() => Api.hentGjenstaendeInnloggetTid());
}
