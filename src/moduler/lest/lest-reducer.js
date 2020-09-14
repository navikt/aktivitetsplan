import * as Api from './lest-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';
import { STATUS } from '../../ducks/utils';

const { reducer, action, selectSlice, selectData, selectStatus } = createActionsAndReducer('lest', 'lest', []);

export function hentLest() {
    return action(Api.hentSisteLest);
}

export function selectLest(state) {
    return selectData(state);
}

function selectLestRessurs(state, ressurs) {
    return selectLest(state).filter((e) => e.ressurs === ressurs)[0];
}

export function selectLestInformasjon(state) {
    return selectLestRessurs(state, 'informasjon');
}

export function selectLestAktivitetsplan(state) {
    return selectLestRessurs(state, 'aktivitetsplan');
}

export function selectLestStatus(state) {
    return selectStatus(state);
}

export function selectLestFeilMelding(state) {
    const feilMeldingsdata = selectLestStatus(state) === STATUS.ERROR && selectSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
}

export default reducer;
