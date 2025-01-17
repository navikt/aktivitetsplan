import { Status } from '../createGenericSlice';
import { mockOppfolging } from '../mocks/data/oppfolging';
import { aktivitetAdapter, getOrCreatePeriode, oppfolgingsdperiodeAdapter } from '../moduler/aktivitet/aktivitet-slice';
import { compareDesc } from 'date-fns';
import { MinimalPeriode } from '../moduler/oppfolging-status/oppfolging-selector';
import { RootState } from '../store';
import { aktivitestplanResponse } from '../mocks/handlers';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { VeilederInfo } from '../datatypes/types';
import { Mal, Oppfolgingsperiode } from '../datatypes/oppfolgingTypes';

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

export const initialLoadedAktiviteterState = ({ aktiviteter }: { aktiviteter?: VeilarbAktivitet[] }) => {
    const state = oppfolgingsdperiodeAdapter.getInitialState({
        status: Status.OK,
    });
    const defaultMockAktiviteter = aktivitestplanResponse(aktiviteter ? { aktiviteter } : undefined);
    const oppfolgingsperioder = defaultMockAktiviteter.data.perioder.map((periode) => {
        const periodeState = getOrCreatePeriode(state, periode.id);
        return {
            id: periode.id,
            aktiviteter: aktivitetAdapter.upsertMany(periodeState.aktiviteter, periode.aktiviteter),
            start: periode.start,
            slutt: periode.slutt,
        };
    });
    return oppfolgingsdperiodeAdapter.upsertMany(state, oppfolgingsperioder);
};

const toMinimalPeriode = (periode: MinimalPeriode | Oppfolgingsperiode): MinimalPeriode => {
    if ('uuid' in periode) {
        return {
            id: periode.uuid,
            start: periode.startDato,
            slutt: periode.sluttDato,
        };
    } else {
        return periode;
    }
};

export const aktiviteterState = ({
    aktiviteter,
    oppfolgingsPerioder,
}: {
    aktiviteter?: VeilarbAktivitet[];
    oppfolgingsPerioder: (MinimalPeriode | Oppfolgingsperiode)[];
}) => {
    const state = oppfolgingsdperiodeAdapter.getInitialState({ status: Status.OK });
    const minimalePerioder = oppfolgingsPerioder.map(toMinimalPeriode);
    const oppfolgingsperioder = minimalePerioder.map((periode) => {
        const periodeState = getOrCreatePeriode(state, periode.id);
        return {
            id: periode.id,
            aktiviteter: aktivitetAdapter.upsertMany(
                periodeState.aktiviteter,
                aktiviteter.filter((aktivitet) => aktivitet.oppfolgingsperiodeId === periode.id),
            ),
            start: periode.start,
            slutt: periode.slutt,
        };
    });
    return oppfolgingsdperiodeAdapter.upsertMany(state, oppfolgingsperioder);
};

export const emptyHalfLoadedVeilederState: RootState = {
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
    view: {},
};


export const initialLoadedEmptyState: RootState = {
    data: {
        aktiviteter: oppfolgingsdperiodeAdapter.getInitialState({
            status: Status.OK,
        }),
        arenaAktiviteter: {
            status: Status.OK,
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
        veileder: {
            status: Status.OK,
            data: { ident: 'A123123', navn: 'Navn', fornavn: 'Fornavn', etternavn: 'Etternavn' } as VeilederInfo,
        },
        mal: {
            status: Status.OK,
            data: {} as Mal,
        },
        lest: {
            status: Status.OK,
            data: [],
        },
        dialog: {
            status: Status.OK,
            sistOppdatert: '',
            data: [],
        },
    },
};
