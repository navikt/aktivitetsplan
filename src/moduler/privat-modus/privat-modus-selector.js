import { aggregerStatus } from '../../ducks/utils';
import {
    selectErBruker,
    selectErVeileder,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import {
    selectErUnderOppfolging,
    selectSituasjonStatus,
} from '../situasjon/situasjon-selector';

export function selectErPrivatModus(state) {
    return selectErUnderOppfolging(state) && selectErVeileder(state);
}

export function selectPrivatModusSlice(state) {
    return {
        status: aggregerStatus(
            selectSituasjonStatus(state),
            selectIdentitetStatus(state)
        ),
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
