import * as Api from '../../api/timeoutboxAPI';
import { createActionsAndReducer } from '../utils/createActionsAndReducer';

const { reducer, action } = createActionsAndReducer('auth');

export default reducer;

export function hentGjenstaendeInnloggetTid() {
    return action(() => Api.hentGjenstaendeInnloggetTid());
}
