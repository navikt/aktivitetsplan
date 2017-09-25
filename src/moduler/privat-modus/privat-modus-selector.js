import { aggregerStatus } from '../../ducks/utils';
import {
    selectErBruker,
    selectErVeileder,
} from '../identitet/identitet-selector';
import { selectErUnderOppfolging } from '../situasjon/situasjon-selector';

export function selectErPrivatModus(state) {
    return !selectErUnderOppfolging(state) && selectErVeileder(state);
}

export function selectPrivatModusSlice(state) {
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

export function selectPrivatModusStatus(state) {
    return selectPrivatModusSlice(state).status;
}

export function selectErPrivatBruker(state) {
    return !selectErUnderOppfolging(state) && selectErBruker(state);
}
