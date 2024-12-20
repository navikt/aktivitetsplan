import { Status } from '../createGenericSlice';
import { mockOppfolging } from '../mocks/data/oppfolging';
import { oppfolgingsdperiodeAdapter } from '../moduler/aktivitet/aktivitet-slice';
import { compareDesc } from 'date-fns';
import { MinimalPeriode } from '../moduler/oppfolging-status/oppfolging-selector';

const veilederIdentitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

const aktivVeilarbOppfolgingMockPeriode = mockOppfolging.oppfolgingsPerioder.toSorted((a, b) => {
    return compareDesc(a.startDato, b.startDato);
})[0];

export const defaultAktivPeriode: MinimalPeriode = {
    start: aktivVeilarbOppfolgingMockPeriode.startDato,
    slutt: aktivVeilarbOppfolgingMockPeriode.sluttDato,
    id: aktivVeilarbOppfolgingMockPeriode.uuid,
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
