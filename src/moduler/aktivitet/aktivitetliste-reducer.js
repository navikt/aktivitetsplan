import { aggregerStatus } from '../../ducks/utils';

// Reducer
export default function reducer(stateData) {
    const privatModusReducer = stateData.privatModus;
    const aktiviteterReducer = stateData.aktiviteter;
    const arenaAktiviteterReducer = stateData.arenaAktiviteter;

    const erPrivatModus = privatModusReducer.erPrivatModus;
    return {
        ...stateData,
        aktivitetListe: {
            status: aggregerStatus(
                privatModusReducer,
                aktiviteterReducer,
                arenaAktiviteterReducer
            ),
            data: aktiviteterReducer.data
                .concat(arenaAktiviteterReducer.data)
                .filter(a => !erPrivatModus || a.historisk),
        },
    };
}
