import { aggregerStatus } from '../../ducks/utils';
import {
    privatModusReducer,
    erPrivatModus,
} from '../privat-modus/privat-modus-selector';

export function aktivitetListe(state) {
    const stateData = state.data;
    const privatModus = erPrivatModus(state);

    return stateData.aktiviteter.data
        .concat(stateData.arenaAktiviteter.data)
        .filter(a => !privatModus || a.historisk);
}

export function aktivitetListeReducer(state) {
    return {
        status: aggregerStatus(
            privatModusReducer(state),
            state.aktiviteter,
            state.arenaAktiviteter
        ),
        data: aktivitetListe(state),
    };
}
