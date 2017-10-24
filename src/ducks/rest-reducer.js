import { doThenDispatch, STATUS } from './utils';

function getActions(navn) {
    const navnUppercase = navn.toUpperCase();
    return {
        PENDING: `${navnUppercase}/PENDING`,
        OK: `${navnUppercase}/OK`,
        FEILET: `${navnUppercase}/FEILET`,
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
                    return {
                        ...state,
                        feil: action.data,
                        status: STATUS.ERROR,
                    };
                default:
                    return state;
            }
        },

        action: fn => doThenDispatch(fn, actions),
    };
}

export default createActionsAndReducer;
