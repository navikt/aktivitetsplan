import { createActionsAndReducer } from '../../ducks/rest-reducer';
import * as Api from '../oppfolging-status/oppfolging-api';

const { reducer, cashedAction } = createActionsAndReducer('identitet');

export default reducer;

export function hentIdentitet() {
    return cashedAction(() => Api.hentIdentitet());
}
