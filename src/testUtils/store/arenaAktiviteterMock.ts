import { ArenaAktivitet } from '../../datatypes/arenaAktivitetTypes';
import { RootState } from '../../store';
import { Status } from '../../createGenericSlice';

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
