import { Status } from '../createGenericSlice';
import { mockOppfolging } from '../mocks/data/oppfolging';
import { RootState } from '../store';
import { FilterState } from '../moduler/filtrering/filter/filter-slice';

const veilederIdentitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

export const emptyLoadedVeilederState: RootState = {
    data: {
        aktiviteter: {
            status: Status.OK,
            data: {
                perioder: [],
            },
        },
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
        auth: {
            status: Status.NOT_STARTED,
            data: undefined,
        },
        errors: {},
        veileder: {
            status: Status.NOT_STARTED,
            data: undefined,
        },
        versjoner: {
            status: Status.NOT_STARTED,
            data: [],
        },
        filter: {
            historiskPeriode: {},
            aktivitetAvtaltMedNav: {},
            aktivitetEtiketter: {},
            aktivitetTyper: {},
            arenaAktivitetEtiketter: {},
        } as FilterState,
        mal: {
            status: Status.NOT_STARTED,
            data: {
                mal: undefined,
                endretAv: 'MEG',
                dato: undefined,
                lest: false,
            },
        },
        dialog: {
            status: Status.NOT_STARTED,
            sistOppdatert: new Date().toISOString(),
            data: [],
        },
        tilgang: {
            status: Status.NOT_STARTED,
            data: undefined,
        },
        lest: {
            status: Status.NOT_STARTED,
            data: undefined,
        },
        feature: {
            status: Status.NOT_STARTED,
            data: undefined,
        },
        malverk: {
            status: Status.NOT_STARTED,
            malverker: [],
            valgtMalverk: {},
        },
        malListe: {
            status: Status.NOT_STARTED,
            data: undefined,
        },
        eskaleringsvarsel: {
            status: Status.NOT_STARTED,
            data: undefined,
        },
    },
    view: {
        dragAndDrop: {
            dragging: false,
            aktivitet: undefined,
        },
        visteAktiviteterMedEndringer: {
            data: [],
        },
    },
};
