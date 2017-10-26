import * as Api from '../situasjon/situasjon-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer('identitet');

export default reducer;

export function hentIdentitet() {
    return cashedAction(() => Api.hentIdentitet());
}
