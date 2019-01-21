import * as Api from './lest-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action, selectData, selectStatus } = createActionsAndReducer(
    'lest',
    'lest',
    []
);

export function hentLest() {
    return action(Api.hentSisteLest);
}

export function selectLest(state) {
    return selectData(state);
}

export function selectLestStatus(state) {
    return selectStatus(state);
}

export default reducer;
