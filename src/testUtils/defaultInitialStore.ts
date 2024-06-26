import { Status } from '../createGenericSlice';
import { mockOppfolging } from '../mocks/data/oppfolging';

const veilederIdentitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

export const emptyLoadedVeilederState = {
    data: {
        aktiviteter: {
            status: Status.NOT_STARTED,
            data: [],
        },
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
