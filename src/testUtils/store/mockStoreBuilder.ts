import { defaultOppfolging, oppfolgingMockSlice, OppfolgingSliceState } from './oppfolgingMockSlice';
import { RootState } from '../../store';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { aktiviteterState } from './aktiviteterMockSlice';
import { GenericState, Status } from '../../createGenericSlice';
import { VeilederInfo } from '../../datatypes/types';
import { Mal } from '../../datatypes/oppfolgingTypes';
import { ReadWriteMode } from '../../utils/readOrWriteModeSlice';
import { aktivVeilarbOppfolgingMockPeriode } from './defaultInitialStore';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { OppfolgingsPeriode } from '../../api/veilarboppfolging';
import { ArenaAktivitet } from '../../datatypes/arenaAktivitetTypes';
import { withArenaAktiviteter } from './arenaAktiviteterMock';
import {
    AktivitetFilterType,
    ArenaEtikettFilterType,
    AvtaltFilterType,
    EtikettFilterType,
} from '../../moduler/filtrering/filter/FilterVisning';

const defaultStore: RootState = {
    view: {
        readOrWriteMode: {
            mode: ReadWriteMode.WRITE,
        },
        dragAndDrop: {
            dragging: false,
            aktivitet: undefined,
        },
        visteAktiviteterMedEndringer: {
            data: [],
        },
    },
    data: {
        aktiviteter: aktiviteterState({ aktiviteter: [], oppfolgingsPerioder: [aktivVeilarbOppfolgingMockPeriode] }),
        oppfolging: defaultOppfolging,
        arenaAktiviteter: {
            status: Status.OK,
            data: [],
        },
        identitet: {
            status: Status.OK,
            data: {
                id: 'Z123456',
                erVeileder: true,
                erBruker: false,
            },
        },
        veileder: {
            status: Status.OK,
            data: { ident: 'A123123', navn: 'Navn', fornavn: 'Fornavn', etternavn: 'Etternavn' },
        } as GenericState<VeilederInfo>,
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

        valgtPeriode: {
            valgtPeriodeId: null,
        },
        arkiv: {
            forhaandsvisning: undefined,
            forhaandsvisningSendTilBruker: undefined,
            forhaandsvisningSendTilBrukerStatus: Status.NOT_STARTED,
            journalføringStatus: Status.NOT_STARTED,
            sendTilBrukerStatus: Status.NOT_STARTED,
            forhaandsvisningStatus: Status.NOT_STARTED,
        },
        errors: {},
        eskaleringsvarsel: {
            data: undefined,
        },
        feature: {
            status: Status.OK,
            data: {
                'aktivitetsplan.journalforing': true,
                'aktivitetsplan.tryggtekst': true,
            },
        },
        filter: {
            aktivitetTyper: {} as AktivitetFilterType,
            aktivitetAvtaltMedNav: {} as AvtaltFilterType,
            aktivitetEtiketter: {} as EtikettFilterType,
            arenaAktivitetEtiketter: {} as ArenaEtikettFilterType,
        },
        innsynsrett: {
            status: Status.OK,
            data: {
                foresatteHarInnsynsrett: true,
                status: Status.OK,
            },
        },
        malListe: {
            status: Status.OK,
            data: [],
        },
        tryggTekst: {
            status: Status.OK,
            data: {
                feilmedling: '',
                kategorier: [],
                tryggTekstReferatId: undefined,
            },
        },
    },
};

const withOppfolging = (store: RootState, oppfolging: OppfolgingSliceState): RootState => ({
    ...store,
    data: {
        ...store.data,
        oppfolging,
    },
});

const withAktiviteter = (
    store: RootState,
    aktiviteter: VeilarbAktivitet[],
    perioder: (OppfolgingsPeriode & { startTidspunkt: string })[],
    status: Status = Status.OK,
): RootState => ({
    ...store,
    data: {
        ...store.data,
        aktiviteter: aktiviteterState({
            aktiviteter,
            oppfolgingsPerioder: perioder,
            status,
        }),
    },
});

export const gitt = (store: RootState = defaultStore) => ({
    oppfolging: {
        manuell: () => gitt(withOppfolging(store, oppfolgingMockSlice.manuell(defaultStore))),
        utdatertIKrr: () => gitt(withOppfolging(store, oppfolgingMockSlice.utdatertIKrr(defaultStore))),
        ikkeRegistrertIKrr: () => gitt(withOppfolging(store, oppfolgingMockSlice.ikkeRegistrertIKrr(defaultStore))),
        reserverIKrr: () => gitt(withOppfolging(store, oppfolgingMockSlice.reserverIKrr(defaultStore))),
        medKvpAktivPeriode: () => gitt(withOppfolging(store, oppfolgingMockSlice.medKvpAktivPeriode(defaultStore))),
    },
    aktiviteter: {
        aktiviteterNotLoaded: () => gitt(withAktiviteter(store, [], [], Status.NOT_STARTED)),
        medAktivitet: (aktiviteter: VeilarbAktivitet) =>
            gitt(withAktiviteter(store, [aktiviteter], [aktivVeilarbOppfolgingMockPeriode])),
        medAktiviteter: (aktiviteter: VeilarbAktivitet[]) =>
            gitt(withAktiviteter(store, aktiviteter, [aktivVeilarbOppfolgingMockPeriode])),
    },

    /* When mocking  */
    aktivteterOgPerioder({
        aktiviteter,
        arenaAktiviteter,
        perioder,
    }: {
        aktiviteter: VeilarbAktivitet[];
        arenaAktiviteter: ArenaAktivitet[];
        perioder: (OppfolgingsPeriode & { startTidspunkt: string })[];
    }) {
        return gitt(
            withArenaAktiviteter(
                withAktiviteter(
                    withOppfolging(store, oppfolgingMockSlice.medPerioder(store, perioder)),
                    aktiviteter,
                    perioder,
                ),
                arenaAktiviteter,
            ),
        );
    },

    createStore: () => lagStore(store),
});

const lagStore = (initialStore: RootState) =>
    configureStore({
        reducer,
        preloadedState: initialStore,
    });
