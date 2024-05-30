import { Status } from '../createGenericSlice';
import { mockOppfolging } from '../mocks/data/oppfolging';
import { oppfolgingsdperiodeAdapter } from '../moduler/aktivitet/aktivitet-slice';

const veilederIdentitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

export const emptyLoadedVeilederState = {
    data: {
        aktiviteter: oppfolgingsdperiodeAdapter.getInitialState({
            status: Status.NOT_STARTED,
        }),
        arenaAktiviteter: {
            status: Status.NOT_STARTED,
            data: [],
        },
        oppfolging: {
            status: Status.OK,
            data: mockOppfolging,
        },
        identitet: {
            status: Status.OK,
            data: veilederIdentitet,
        },
    },
};
