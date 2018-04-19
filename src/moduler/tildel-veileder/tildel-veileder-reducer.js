import { createActionsAndReducer } from '../../ducks/rest-reducer';
import * as Api from './tildel-veileder-api';

const { reducer, action } = createActionsAndReducer('tildel-veileder');

export default reducer;

export function tildelVeileder(tilordning) {
    return action(() => Api.tildordneVeileder(tilordning));
}
