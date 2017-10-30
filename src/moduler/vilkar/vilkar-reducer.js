import * as Api from '../oppfolging-status/oppfolging-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('vilkar', 'vilkar', {
    tekst: '',
});

export default reducer;

export function hentVilkar() {
    return action(() => Api.hentVilkar());
}
