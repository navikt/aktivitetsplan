import * as Api from '../ducks/feature-api';
import { createActionsAndReducer } from '../ducks/rest-reducer';

const { reducer, cashedAction, actionTypes } = createActionsAndReducer(
    'feature'
);

export default reducer;

export function hentFeature() {
    return cashedAction(() => Api.hentFeature());
}
