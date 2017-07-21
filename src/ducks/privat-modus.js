import { STATUS } from './utils';

// Reducer
export default function reducer(state) {
    const situasjonReducer = state.situasjon;
    const identitetReducer = state.identitet;
    return {
        ...state,
        privatModus: {
            status: STATUS.OK,
            erPrivatModus:
                situasjonReducer.data.underOppfolging === false &&
                identitetReducer.data.erVeileder,
        },
    };
}
