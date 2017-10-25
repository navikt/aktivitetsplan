import { doThenDispatch, STATUS } from './utils';

function getActions(navn) {
    const navnUppercase = navn.toUpperCase();
    return {
        PENDING: `${navnUppercase}/PENDING`,
        OK: `${navnUppercase}/OK`,
        FEILET: `${navnUppercase}/FEILET`,
    };
}

export function createActionsAndReducer(navn, defaultData = {}) {
    const defaultState = { data: defaultData, status: STATUS.NOT_STARTED };
    const actions = getActions(navn);
    return {
        reducer: (state = defaultState, action) => {
            const data = action.data;
            switch (action.type) {
                case actions.PENDING:
                    return {
                        ...state,
                        data,
                        status:
                            state.status === STATUS.NOT_STARTED
                                ? STATUS.PENDING
                                : STATUS.RELOADING,
                    };
                case actions.OK:
                    return { ...state, data, status: STATUS.OK };
                case actions.FEILET:
                    return {
                        ...state,
                        feil: data,
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
