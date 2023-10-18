/* Provide both redux-store and "in-memory" router for all sub-components to render correctly */
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Hovedside from '../../../hovedside/Hovedside';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { arenaMockAktiviteter } from '../../../mocks/data/arena';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../../reducer';
import { mockTestAktiviteter } from '../../../mocks/aktivitet';
import { Status } from '../../../createGenericSlice';
import { mockOppfolging } from '../../../mocks/data/oppfolging';
import { RootState } from '../../../store';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { handlers } from '../../../mocks/handlers';
import { datoErIPeriode } from './filter-utils';
import { expect } from 'vitest';
import { erHistorisk, HistoriskOppfolgingsperiode, Oppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';

vi.mock('../../../felles-komponenter/utils/logging', async () => {
    const actual: object = await vi.importActual('../../../felles-komponenter/utils/logging');
    return {
        ...actual,
        default: vi.fn(),
        loggTidBruktGaaInnPaaAktivitetsplanen: vi.fn(),
        logTimeToAktivitestavlePaint: vi.fn(),
        loggingAntallBrukere: vi.fn(),
    };
});

const identitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

const WrappedHovedside = ({ store }: { store: ToolkitStore }) => {
    return (
        <Provider store={store}>
            <MemoryRouter>
                <Hovedside />
            </MemoryRouter>
        </Provider>
    );
};

const gjeldendeOppfolgingsperiode = mockOppfolging.oppfolgingsPerioder.find((it) => !erHistorisk(it));
const gammelOppfolgingsperiode: HistoriskOppfolgingsperiode = mockOppfolging.oppfolgingsPerioder.find((it) =>
    erHistorisk(it),
);

const arenaAktivitet = {
    ...arenaMockAktiviteter[0],
    tittel: 'Arenaaktivitet',
    id: 'ARENATA11',
};
const gammelArenaAktivitet = {
    ...arenaMockAktiviteter[0],
    tittel: 'Gammel Arenaaktivitet',
    id: 'ARENATA22',
    opprettetDato: '2017-02-30T10:46:10.971+01:00', // I gammel oppfølgingsperiode
};
const veilarbAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: 'Veilarbaktivitet',
    id: '1',
    oppfolgingsperiodeId: gjeldendeOppfolgingsperiode?.uuid,
};
const gammelVeilarbAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: 'Gammel Veilarbaktivitet',
    id: '2',
    oppfolgingsperiodeId: gammelOppfolgingsperiode?.uuid,
};

const initialStore = {
    data: {
        aktiviteter: {
            status: Status.OK,
            data: {
                perioder: [
                    {
                        id: veilarbAktivitet.oppfolgingsperiodeId,
                        aktiviteter: [veilarbAktivitet],
                    },
                    {
                        id: gammelVeilarbAktivitet.oppfolgingsperiodeId,
                        aktiviteter: [gammelVeilarbAktivitet],
                    },
                ],
            },
        },
        arenaAktiviteter: {
            status: Status.OK,
            data: [arenaAktivitet, gammelArenaAktivitet],
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
} as unknown as RootState;

const server = setupServer(...handlers);
describe('PeriodeFilter.tsx', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    describe('Veilarbaktivitet filtrering', () => {
        it('skal vise veilarb-aktivitet i nåværende periode (første i listen)', () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            getByText('Veilarbaktivitet');
            expect(queryByText('Gammel Veilarbaktivitet')).not.toBeTruthy();
        });
        it('skal vise veilarb-aktivitet i tidligere periode', async () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            await userEvent.selectOptions(screen.getByLabelText('Periode'), '30. Jan 2017 - 31. Dec 2017');
            getByText('Gammel Veilarbaktivitet');
            expect(queryByText('Veilarbaktivitet')).not.toBeTruthy();
        });
    });

    describe('Arenaaktivitet filtrering', () => {
        it('skal vise arena-ativitet i nåværende periode (første i listen)', () => {
            const store = configureStore({ reducer, preloadedState: initialStore });
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            getByText('Arenaaktivitet');
            expect(queryByText('Gammel Arenaaktivitet')).not.toBeTruthy();
        });
        it('skal vise arena-aktivitet i tidligere periode', async () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            await userEvent.selectOptions(screen.getByLabelText('Periode'), '30. Jan 2017 - 31. Dec 2017');
            getByText('Gammel Arenaaktivitet');
            expect(queryByText('Arenaaktivitet')).not.toBeTruthy();
        });
        describe('datoErIPeriode-filter', () => {
            const gammelOpprettetDato = gammelArenaAktivitet.opprettetDato;
            const currentOpprettetDato = arenaAktivitet.opprettetDato;
            const gammelPeriodeSlutt = gammelOppfolgingsperiode!.sluttDato;
            it('nåværende periode - gammel aktivitet skal ikke vises', () => {
                expect(datoErIPeriode(gammelOpprettetDato, null, gammelPeriodeSlutt)).toBeFalsy();
            });
            it('nåværende periode - aktivitet i nåværende periode skal vises', () => {
                expect(datoErIPeriode(currentOpprettetDato, null, gammelPeriodeSlutt)).toBeTruthy();
            });
            it('gammel periode - gammel aktivitet skal vises', () => {
                expect(datoErIPeriode(gammelOpprettetDato, gammelOppfolgingsperiode, gammelPeriodeSlutt)).toBeTruthy();
            });
            it('gammel periode - aktivitet i nåværende periode skal ikke vises', () => {
                expect(datoErIPeriode(currentOpprettetDato, gammelOppfolgingsperiode, gammelPeriodeSlutt)).toBeFalsy();
            });
        });
    });
});
