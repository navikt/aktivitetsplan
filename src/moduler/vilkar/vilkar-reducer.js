import * as Api from '../situasjon/situasjon-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('vilkar', { tekst: '' });

export default reducer;

export function hentVilkar() {
    return action(() => Api.hentVilkar());
}
