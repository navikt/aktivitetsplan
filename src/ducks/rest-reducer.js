import { doThenDispatch, STATUS } from './utils';

function getActions(navn) {
    const navnUppercase = navn.toUpperCase();
    return {
        PENDING: `${navnUppercase}/PENDING`,
        OK: `${navnUppercase}/OK`,
        FEILET: `${navnUppercase}/FEILET`,
    };
}

export function createActionsAndReducer(navn, initialData = {}) {
    const initialState = { data: initialData, status: STATUS.NOT_STARTED };
    const actionTypes = getActions(navn);
    return {
        reducer: (state = initialState, action) => {
            switch (action.type) {
                case actionTypes.PENDING:
                    return {
                        ...state,
                        status:
                            state.status === STATUS.NOT_STARTED
                                ? STATUS.PENDING
                                : STATUS.RELOADING,
                    };
                case actionTypes.OK:
                    return { ...state, data: action.data, status: STATUS.OK };
                case actionTypes.FEILET:
                    return {
                        ...state,
                        feil: action.data,
                        status: STATUS.ERROR,
                    };
                default:
                    return state;
            }
        },

        action: fn => doThenDispatch(fn, actionTypes),
    };
}

export function createDefaultDataSelectors(path, initialData = {}) {
    const selectSlice = state => state.data[path];
    return {
        selectStatus: state => selectSlice(state).status,
        selectData: state => selectSlice(state).data || initialData,
    };
}
