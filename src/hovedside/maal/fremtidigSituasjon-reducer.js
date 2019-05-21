import * as Api from '../../moduler/oppfolging-status/oppfolging-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const {
    reducer,
    selectData,
    selectStatus,
    action,
} = createActionsAndReducer('fremtidigSituasjon');

export default reducer;

export function hentFremtidigSituasjon() {
    return action(() => Api.hentFremtidigSituasjon());
}

export function selectFremtidigSituasjonStatus(state) {
    return selectStatus(state);
}

export function selectFremtidigSituasjonData(state) {
    return selectData(state);
}

