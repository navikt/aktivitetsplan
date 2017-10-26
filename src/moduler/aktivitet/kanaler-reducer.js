import * as Api from './aktivitet-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer(
    'kanal',
    'kanaler',
    []
);

export default reducer;

export function hentKanaler() {
    return cashedAction(() => Api.hentKanaler());
}
