import Api from './ledtekster-api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'ledetekster/OK';
export const FEILET = 'ledetekster/FEILET';
export const PENDING = 'ledetekster/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {},
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case PENDING:
            return {
                ...state,
                status:
                    state.status === STATUS.NOT_STARTED
                        ? STATUS.PENDING
                        : STATUS.RELOADING,
            };
        case FEILET:
            return { ...state, status: STATUS.ERROR, feil: action.data };
        case OK: {
            return { ...state, status: STATUS.OK, data: action.data };
        }
        default:
            return state;
    }
}

function konverterledetekster(ledetekster) {
    return Object.keys(ledetekster)
        .map(key => ({ key, value: `${ledetekster[key]} [${key}]` }))
        .reduce((previous, current) => {
            previous[current.key] = current.value; // eslint-disable-line no-param-reassign
            return previous;
        }, {});
}

function hentLedeteksterMedKeys() {
    return Api.hentLedetekster().then(data =>
        Object.keys(data)
            .map(sprak => ({ sprak, keys: konverterledetekster(data[sprak]) }))
            .reduce((previous, current) => {
                previous[current.sprak] = current.keys; // eslint-disable-line no-param-reassign
                return previous;
            }, {})
    );
}

// Action Creators
export function hentLedetekster() {
    const vistekster = window.location.search.indexOf('vistekster') !== -1;
    return doThenDispatch(
        vistekster ? hentLedeteksterMedKeys : Api.hentLedetekster,
        {
            OK,
            FEILET,
            PENDING,
        }
    );
}
