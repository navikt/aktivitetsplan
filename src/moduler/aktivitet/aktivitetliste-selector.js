import { aggregerStatus } from '../../ducks/utils';
import {
    selectPrivatModusReducer,
    selectErPrivatModus,
} from '../privat-modus/privat-modus-selector';
import { aktivitetFilter } from '../filter/filter-utils';

export function selectAktivitetListe(state) {
    const stateData = state.data;
    const privatModus = selectErPrivatModus(state);

    return stateData.aktiviteter.data
        .concat(stateData.arenaAktiviteter.data)
        .filter(a => !privatModus || a.historisk)
        .filter(a => aktivitetFilter(a, state));
}

export function selectAktivitetMedId(state, aktivitetId) {
    return selectAktivitetListe(state).find(
        aktivitet => aktivitet.id === aktivitetId
    );
}

export function selectAktivitetListeReducer(state) {
    return {
        status: aggregerStatus(
            selectPrivatModusReducer(state),
            state.aktiviteter,
            state.arenaAktiviteter
        ),
        data: selectAktivitetListe(state),
    };
}

export function selectAktivitetListeStatus(state) {
    return selectAktivitetListeReducer(state).status;
}
