// Actions
import { doThenDispatch, STATUS } from '../../../ducks/utils';
import * as Api from '../../../ducks/api';

export const HENT_VEILEDERE_OK = '/hent-veiledere/OK';
export const HENT_VEILEDERE_FEILET = '/hent-veiledere/FEILET';
export const HENT_VEILEDERE_PENDING = '/hent-veiledere/PENDING';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
};

export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_VEILEDERE_OK:
            return {
                data: action.data.veilederListe,
                status: STATUS.OK,
            };
        case HENT_VEILEDERE_FEILET:
            return {
                data: action.data,
                status: STATUS.ERROR,
            };
        case HENT_VEILEDERE_PENDING:
            return {
                status: STATUS.PENDING,
            };
        default:
            return state;
    }
}

// Selectors
export function selectOppgaveVeiledere(state) {
    return state.data.oppgaveVeiledere;
}

// Action creators
export function hentVeiledereForEnhet(enhetid) {
    return doThenDispatch(() => Api.hentVeieldereForEnhet(enhetid), {
        OK: HENT_VEILEDERE_OK,
        FEILET: HENT_VEILEDERE_FEILET,
        PENDING: HENT_VEILEDERE_PENDING,
    });
}

