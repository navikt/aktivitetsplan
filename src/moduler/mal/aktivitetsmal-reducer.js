import * as Api from '../oppfolging-status/oppfolging-api';
import { hentMalListe } from './malliste-reducer';
import { createActionsAndReducer } from '../../ducks/rest-reducer';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';
import { selectMalListe } from './aktivitetsmal-selector';

const { reducer, action, selectStatus, selectData } = createActionsAndReducer(
    'mal'
);

export default reducer;

export function hentMal() {
    return action(() => Api.hentMal());
}

export function oppdaterMal(mal) {
    return action(() => Api.lagreMal(mal));
}

export function slettMal() {
    return dispatch => {
        const slettMalAction = action(() => Api.slettMal());
        return dispatch(slettMalAction).then(data => {
            dispatch(hentMalListe());
            return data;
        });
    };
}

function selectMalData(state) {
    return selectData(state);
}

export function selectMalStatus(state) {
    return selectStatus(state);
}

export function selectGjeldendeMal(state) {
    return selectViserInneverendePeriode(state)
        ? selectMalData(state)
        : selectMalListe(state)[0];
}
