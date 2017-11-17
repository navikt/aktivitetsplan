import * as Api from '../motpart/motpart-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer('bruker');

export default reducer;

export function hentBruker(fnr) {
    return cashedAction(() => Api.hentPerson(fnr));
}
