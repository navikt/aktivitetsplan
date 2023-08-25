import { configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { fireEvent, getByRole, render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Store } from 'redux';

import { Status } from '../../../createGenericSlice';
import {
    AktivitetStatus,
    AlleAktiviteter,
    StillingFraNavSoknadsstatus,
    StillingStatus,
} from '../../../datatypes/aktivitetTypes';
import {
    StillingFraNavAktivitet,
    VeilarbAktivitet,
    VeilarbAktivitetType,
} from '../../../datatypes/internAktivitetTypes';
import Hovedside from '../../../hovedside/Hovedside';
import { wrapAktivitet } from '../../../mocks/aktivitet';
import { mockOppfolging } from '../../../mocks/data/oppfolging';
import { enStillingFraNavAktivitet } from '../../../mocks/fixtures/stillingFraNavFixtures';
import { handlers } from '../../../mocks/handlers';
import reducer from '../../../reducer';
import { aktivitetTypeMap, stillingsEtikettMapper } from '../../../utils/textMappers';
import { hentAktiviteter } from '../../aktivitet/aktivitet-actions';

const identitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

const initialStore = {
    data: {
        aktiviteter: {
            status: Status.OK,
            data: [],
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
            data: identitet,
        },
    },
};

vi.mock('../../../felles-komponenter/utils/logging', async () => {
    const actual: any = await vi.importActual('../../../felles-komponenter/utils/logging');
    return {
        ...actual,
        default: vi.fn(),
        loggTidBruktGaaInnPaaAktivitetsplanen: vi.fn(),
        logTimeToAktivitestavlePaint: vi.fn(),
        loggingAntallBrukere: vi.fn(),
    };
});

/* Provider both redux-store and "in-memory" router for all sub-components to render correctly */
const WrappedHovedside = ({ store }: { store: ToolkitStore }) => {
    return (
        <Provider store={store}>
            <MemoryRouter>
                <Hovedside />
            </MemoryRouter>
        </Provider>
    );
};

let id = 12012;
const exampleAktivitet = wrapAktivitet({
    ...enStillingFraNavAktivitet({ tittel: 'Servitør', arstall: 2017 }),
    arbeidsgiver: 'Arbeidsgiver',
    status: AktivitetStatus.GJENNOMFOERT,
});
function makeTestAktiviteter<T>(
    store: Store,
    filterValues: T[],
    valueSetter: (aktivitet: AlleAktiviteter, value: T) => AlleAktiviteter
) {
    const testAktiviteter = filterValues.map((filterValue) => {
        id += 1;
        return {
            ...valueSetter(exampleAktivitet, filterValue),
            id,
            tittel: `Aktivitet: ${filterValue}`,
        };
    }) as unknown as VeilarbAktivitet[];
    store.dispatch(
        hentAktiviteter.fulfilled(
            {
                aktiviteter: testAktiviteter,
            },
            'asd'
        )
    );
    return testAktiviteter.map(({ tittel, type }) => ({ tittel, type }));
}

const server = setupServer(...handlers);

describe('aktivitets-filter', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    it('should filter avtalt med nav', async () => {
        const store = configureStore({ reducer, preloadedState: initialStore as any });
        makeTestAktiviteter(store, [true, false], (aktivitet, value) => {
            return {
                ...aktivitet,
                avtalt: value,
            };
        });
        const { getByLabelText, getByText, queryByText, getByRole } = render(<WrappedHovedside store={store} />);

        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull()
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(getByLabelText('Ikke avtalt med NAV'));
        getByRole('checkbox', { name: 'Ikke avtalt med NAV', checked: true });

        getByText('Aktivitet: false');
        expect(queryByText('Aktivitet: true')).toBeFalsy();
        fireEvent.click(getByLabelText('Avtalt med NAV'));
        fireEvent.click(getByLabelText('Ikke avtalt med NAV'));
        getByText('Aktivitet: true');
        expect(queryByText('Aktivitet: false')).toBeFalsy();
        expect(queryByText('Assisterende skipskokk')).toBeNull();
    });

    it('should filter on aktivitet type', async () => {
        const aktivitetTyper = [
            VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE,
            VeilarbAktivitetType.MOTE_TYPE,
            VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
        ];
        const store = configureStore({ reducer, preloadedState: initialStore as any });
        const aktiviteter = makeTestAktiviteter<VeilarbAktivitetType>(store, aktivitetTyper, (aktivitet, value) => {
            return {
                ...aktivitet,
                type: value,
            } as AlleAktiviteter;
        }) as {
            tittel: string;
            type:
                | VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE
                | VeilarbAktivitetType.MOTE_TYPE
                | VeilarbAktivitetType.STILLING_AKTIVITET_TYPE;
        }[];
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        for await (const { tittel, type } of aktiviteter) {
            await waitFor(() =>
                expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull()
            );

            fireEvent.click(getByRole('button', { name: 'Filtrer' }));

            fireEvent.click(queryAllByText(aktivitetTypeMap[type])[0]);
            getByText(tittel);
            // Sjekk at ingen andre aktiviteter vises
            aktivitetTyper
                .filter((andreTyper) => andreTyper != type)
                .forEach((typeSomIkkeSkalFinnes) => {
                    expect(queryByText(`Aktivitet: ${typeSomIkkeSkalFinnes}`)).toBeNull();
                });
            // Turn filter off
            fireEvent.click(queryAllByText(aktivitetTypeMap[type])[0]);
            // Close filter
            fireEvent.click(getByText('Filtrer'));
        }
    });

    it('Should filter based on etiketter (stilling fra NAV)', async () => {
        const store = configureStore({ reducer, preloadedState: initialStore as any });
        const statuser: StillingFraNavSoknadsstatus[] = [
            StillingFraNavSoknadsstatus.AVSLAG,
            StillingFraNavSoknadsstatus.VENTER,
        ];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                stillingFraNavData: {
                    ...(aktivitet as unknown as StillingFraNavAktivitet).stillingFraNavData,
                    soknadsstatus: value,
                },
            };
        });
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        getByText(`Aktivitet: VENTER`);
        getByText(`Aktivitet: AVSLAG`);
        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull()
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(queryAllByText(stillingsEtikettMapper['AVSLAG'])[0]);
        expect(getByText(`Aktivitet: AVSLAG`)).not.toBeNull();
        expect(queryByText(`Aktivitet: SOKNAD_SENDT`)).toBeNull();
        fireEvent.click(getByText('Filtrer'));
    });

    it('Should filter based on etiketter (stilling)', async () => {
        const store = configureStore({ reducer, preloadedState: initialStore as any });
        const statuser: StillingStatus[] = [StillingStatus.INNKALT_TIL_INTERVJU, StillingStatus.SOKNAD_SENDT];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                etikett: value,
                type: VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
            } as AlleAktiviteter;
        });
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        getByText(`Aktivitet: INNKALT_TIL_INTERVJU`);
        getByText(`Aktivitet: SOKNAD_SENDT`);
        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull()
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(queryAllByText(stillingsEtikettMapper['INNKALT_TIL_INTERVJU'])[0]);
        expect(getByText(`Aktivitet: INNKALT_TIL_INTERVJU`)).not.toBeNull();
        expect(queryByText(`Aktivitet: SOKNAD_SENDT`)).toBeNull();
    });
});
