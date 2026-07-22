import { ArenaAktivitet } from '../../datatypes/arenaAktivitetTypes';
import { RootState } from '../../store/rootReducer';
import { Status } from '../../store/createGenericSlice';

// export const arenaAktiviteterMockSlice = {
//     medArenaAktiviteter: (arenaAktiviteter: ArenaAktivitet[]) => {},
// };

export const withArenaAktiviteter = (store: RootState, arenaAktiviteter: ArenaAktivitet[]): RootState => ({
    ...store,
    data: {
        ...store.data,
        arenaAktiviteter: {
            status: Status.OK,
            data: arenaAktiviteter,
        },
    },
});
