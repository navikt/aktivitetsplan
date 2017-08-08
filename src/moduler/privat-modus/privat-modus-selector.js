import { aggregerStatus } from '../../ducks/utils';

export function selectErPrivatModus(state) {
    const stateData = state.data;
    const situasjonReducer = stateData.situasjon;
    const identitetReducer = stateData.identitet;

    return (
        situasjonReducer.data.underOppfolging === false &&
        identitetReducer.data.erVeileder
    );
}

export function selectPrivatModusReducer(state) {
    const stateData = state.data;
    const situasjonReducer = stateData.situasjon;
    const identitetReducer = stateData.identitet;

    return {
        status: aggregerStatus(situasjonReducer, identitetReducer),
        data: {
            erPrivatModus: selectErPrivatModus(state),
        },
    };
}
