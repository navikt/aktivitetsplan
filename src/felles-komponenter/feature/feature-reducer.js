import * as Api from '../../api/featureAPI';
import { createActionsAndReducer } from '../utils/createActionsAndReducer';

const { reducer, cashedAction } = createActionsAndReducer('feature');

export default reducer;

export function hentFeature(enhet) {
    return cashedAction(() => Api.hentFeature(enhet));
}
