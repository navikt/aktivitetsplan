import { doThenDispatch, STATUS } from './utils';

function getActions(navn) {
    return {
        PENDING: `${navn.toUpperCase()}/PENDING`,
        OK: `${navn.toUpperCase()}/OK`,
        FEILET: `${navn.toUpperCase()}/FEILET`,
    };
}

export function createActionsAndReducer(navn) {
    const defaultState = { data: {}, status: STATUS.NOT_STARTED };
    const actions = getActions(navn);
    return {
        reducer: (state = defaultState, action) => {
            switch (action.type) {
                case actions.PENDING:
                    return {
                        ...state,
                        data: action.data,
                        status: STATUS.PENDING,
                    };
                case actions.OK:
                    return { ...state, data: action.data, status: STATUS.OK };
                case actions.FEILET:
                    return { ...state, status: STATUS.ERROR };
                default:
                    return state;
            }
        },

        action: fn => doThenDispatch(fn, actions),
    };
}

export default createActionsAndReducer;
