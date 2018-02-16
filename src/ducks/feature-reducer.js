import * as Api from '../ducks/feature-api';
import { createActionsAndReducer } from '../ducks/rest-reducer';

const initialData = {
    aktivitetsplan: {
        kvp: false,
    },
    veilarbaktivitetsplanfs: {
        kvp: true,
    },
};

const { reducer, cashedAction } = createActionsAndReducer(
    'feature',
    'feature',
    initialData
);

export default reducer;

export function hentFeature() {
    return cashedAction(() => Api.hentFeature());
}
