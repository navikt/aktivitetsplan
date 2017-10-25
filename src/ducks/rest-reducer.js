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
    const actionTypes = getActions(navn);
    return {
        reducer: (state = defaultState, action) => {
            const data = action.data;
            switch (action.type) {
                case actionTypes.PENDING:
                    return {
                        ...state,
                        data,
                        status:
                            state.status === STATUS.NOT_STARTED
                                ? STATUS.PENDING
                                : STATUS.RELOADING,
                    };
                case actionTypes.OK:
                    return { ...state, data, status: STATUS.OK };
                case actionTypes.FEILET:
                    return {
                        ...state,
                        feil: data,
                        status: STATUS.ERROR,
                    };
                default:
                    return state;
            }
        },

        action: fn => doThenDispatch(fn, actionTypes),
    };
}

export default createActionsAndReducer;
