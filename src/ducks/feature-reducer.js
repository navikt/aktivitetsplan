import * as Api from './feature-api';
import { createActionsAndReducer } from './rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer('feature');

export default reducer;

export function hentFeature(enhet) {
    return cashedAction(() => Api.hentFeature(enhet));
}
