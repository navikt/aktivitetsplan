import { aggregerStatus } from '../../ducks/utils';
import {
    selectPrivatModusSlice,
    selectErPrivatModus,
} from '../privat-modus/privat-modus-selector';
import { aktivitetFilter } from '../filter/filter-utils';

export function selectAlleAktiviter(state) {
    const stateData = state.data;
    return stateData.aktiviteter.data.concat(stateData.arenaAktiviteter.data);
}

export function selectAktivitetListe(state) {
    const privatModus = selectErPrivatModus(state);
    return selectAlleAktiviter(state)
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
            selectPrivatModusSlice(state),
            state.aktiviteter,
            state.arenaAktiviteter
        ),
        data: selectAktivitetListe(state),
    };
}

export function selectAktivitetListeStatus(state) {
    return selectAktivitetListeReducer(state).status;
}
