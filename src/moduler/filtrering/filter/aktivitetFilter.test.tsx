import { fireEvent, getByRole, render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Store } from 'redux';

import { STATUS } from '../../../api/utils';
import {
    AktivitetStatus,
    AlleAktiviteter,
    StillingFraNavSoknadsstatus,
    StillingStatus,
} from '../../../datatypes/aktivitetTypes';
import { StillingFraNavAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import Hovedside from '../../../hovedside/Hovedside';
import { wrapAktivitet } from '../../../mocks/aktivitet';
import { mockOppfolging } from '../../../mocks/data/oppfolging';
import { enStillingFraNavAktivitet } from '../../../mocks/fixtures/stillingFraNavFixtures';
import { handlers } from '../../../mocks/handlers';
import reducer, { State } from '../../../reducer';
import create from '../../../store';
import { aktivitetTypeMap, stillingsEtikettMapper } from '../../../utils/textMappers';
import { HENT_AKTIVITET_OK } from '../../aktivitet/aktivitet-action-types';

const identitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

const initialStore = {
    ...reducer({} as any, { type: 'INITAL' }),
    data: {
        aktiviteter: {
            status: STATUS.OK,
            data: [],
        },
        arenaAktiviteter: {
            status: STATUS.OK,
            data: [],
        },
        oppfolging: {
            status: STATUS.OK,
            data: mockOppfolging,
        },
        identitet: {
            status: STATUS.OK,
            data: identitet,
        },
        feature: {
            status: STATUS.OK,
            data: { ignore: false },
        },
    },
} as State;

/* Provider both redux-store and "in-memory" router for all sub-components to render correctly */
const WrappedHovedside = ({ store }: { store: Store }) => {
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
    });
    store.dispatch({
        type: HENT_AKTIVITET_OK,
        data: testAktiviteter,
    });
    return testAktiviteter.map(({ tittel, type }) => ({ tittel, type }));
}

const server = setupServer(...handlers);

describe.skip('aktivitets-filter', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    it('should filter avtalt med nav', async () => {
        const store = create(initialStore);
        const { getByLabelText, getByText, queryByText, getByRole } = render(<WrappedHovedside store={store} />);
        makeTestAktiviteter(store, [true, false], (aktivitet, value) => {
            return {
                ...aktivitet,
                avtalt: value,
            };
        });
        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull()
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(getByLabelText('Ikke avtalt med NAV'));
        getByRole('checkbox', { name: 'Ikke avtalt med NAV', checked: true });

        getByText('Aktivitet: false');
        expect(queryByText('Aktivitet: true')).toBeFalsy();
        fireEvent.click(getByText('Avtalt med NAV'));
        fireEvent.click(getByText('Ikke avtalt med NAV'));
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
        const store = create(initialStore);
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
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
        const store = create(initialStore);
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        const statuser: StillingFraNavSoknadsstatus[] = ['AVSLAG', 'VENTER'];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                stillingFraNavData: {
                    ...(aktivitet as unknown as StillingFraNavAktivitet).stillingFraNavData,
                    soknadsstatus: value,
                },
            };
        });
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
        const store = create(initialStore);
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        const statuser: StillingStatus[] = ['INNKALT_TIL_INTERVJU', 'SOKNAD_SENDT'];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                etikett: value,
                type: VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
            } as AlleAktiviteter;
        });
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
