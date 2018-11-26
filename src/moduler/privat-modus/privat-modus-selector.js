import { aggregerStatus } from '../../ducks/utils';
import {
    selectErBruker,
    selectErVeileder,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import {
    selectErUnderOppfolging,
    selectOppfolgingStatus,
} from '../oppfolging-status/oppfolging-selector';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';
import {
    harFeature,
    SKRUAVPRIVATMODUS,
} from '../../felles-komponenter/feature/feature';

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

export function selectErPrivatBruker(state) {
    return !selectErUnderOppfolging(state) && selectErBruker(state);
}

// todo remove me
export function erPrivateBrukerSomSkalSkrusAv(state) {
    const toggle = harFeature(SKRUAVPRIVATMODUS, selectFeatureData(state));
    return toggle && selectErPrivatBruker(state);
}
