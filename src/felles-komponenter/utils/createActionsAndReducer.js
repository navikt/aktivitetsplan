import { doThenDispatch } from '../../api/utils';
import { Status } from '../../createGenericSlice';

function getActions(navn) {
    const navnUppercase = navn.toUpperCase();
    return {
        PENDING: `${navnUppercase}/PENDING`,
        OK: `${navnUppercase}/OK`,
        FEILET: `${navnUppercase}/FEILET`,
    };
}

export function createActionsAndReducer(navn, statePath = navn, initialData = {}) {
    const initialState = { data: initialData, status: Status.NOT_STARTED };
    const actionTypes = getActions(navn);
    const selectSlice = (state) => state.data[statePath];
    const selectStatus = (state) => selectSlice(state).status;
    const actionFunction = (fn) => doThenDispatch(fn, actionTypes);
    let promise = null;

    return {
        reducer: (state = initialState, action) => {
            switch (action.type) {
                case actionTypes.PENDING:
                    return {
                        ...state,
                        status: state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING,
                    };
                case actionTypes.OK:
                    return {
                        ...state,
                        data: action.data || initialData,
                        status: Status.OK,
                    };
                case actionTypes.FEILET:
                    return {
                        ...state,
                        feil: action.data,
                        status: Status.ERROR,
                    };
                default:
                    return state;
            }
        },

        selectStatus,
        selectSlice,
        selectData: (state) => selectSlice(state).data,

        action: actionFunction,
        cashedAction: (fn) => (dispatch, getState) => {
            const status = selectStatus(getState());
            if (status === Status.NOT_STARTED || status === Status.ERROR) {
                promise = actionFunction(fn)(dispatch);
                return promise;
            }
            return promise;
        },

        actionTypes,
    };
}

export default createActionsAndReducer;
