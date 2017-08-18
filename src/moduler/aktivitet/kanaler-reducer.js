import * as AT from './aktivitet-action-types';
import { doThenDispatch, STATUS } from '../../ducks/utils';
import * as Api from './aktivitet-api';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
};

export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case AT.HENT_KANALER:
            return { ...state, status: STATUS.PENDING };
        case AT.HENT_KANALER_FEILET:
            return { ...state, status: STATUS.ERROR, feil: data };
        case AT.HENT_KANALER_OK:
            return { ...state, status: STATUS.OK, data };
        default:
            return state;
    }
}

export function selectKanalerReducer(state) {
    return state.data.kanaler;
}

export function selectStatus(state) {
    return selectKanalerReducer(state).status;
}

export function selectKanaler(state) {
    return selectKanalerReducer(state).data;
}

export function hentKanaler() {
    return (dispatch, getState) => {
        const status = selectStatus(getState());
        if (status === STATUS.NOT_STARTED || status === STATUS.ERROR) {
            doThenDispatch(() => Api.hentKanaler(), {
                OK: AT.HENT_KANALER_OK,
                FEILET: AT.HENT_KANALER_FEILET,
                PENDING: AT.HENT_KANALER,
            })(dispatch);
        }
    };
}
