import * as Api from '../../moduler/oppfolging-status/oppfolging-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer('veilederTilgang');

export default reducer;

export function hentVeilederTilgang() {
    return cashedAction(() => Api.hentVeilederTilgang());
}
