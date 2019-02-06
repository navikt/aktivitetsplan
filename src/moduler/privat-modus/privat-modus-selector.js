import { aggregerStatus } from '../../ducks/utils';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import {
    selectErUnderOppfolging,
    selectOppfolgingStatus,
} from '../oppfolging-status/oppfolging-selector';

export function selectErPrivatModus(state) {
    return !selectErUnderOppfolging(state) && selectErVeileder(state);
}

export function selectPrivatModusSlice(state) {
    return {
        status: aggregerStatus(
            selectOppfolgingStatus(state),
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
