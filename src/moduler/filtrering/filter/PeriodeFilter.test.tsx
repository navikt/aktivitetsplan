/* Provide both redux-store and "in-memory" router for all sub-components to render correctly */
import React from 'react';
import { arenaMockAktiviteter } from '../../../mocks/data/arena';
import { render, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../../reducer';
import { mockTestAktiviteter } from '../../../mocks/aktivitet';
import { Status } from '../../../createGenericSlice';
import { mockOppfolging } from '../../../mocks/data/oppfolging';
import { RootState } from '../../../store';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { aktivitestplanResponse, handlers } from '../../../mocks/handlers';
import { datoErIPeriode } from './filter-utils';
import { expect } from 'vitest';
import { erHistorisk, HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { WrappedHovedside } from '../../../testUtils/WrappedHovedside';
import { emptyLoadedVeilederState } from '../../../testUtils/defaultInitialStore';
import { rest } from 'msw';
import { failOrGrahpqlResponse } from '../../../mocks/utils';

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

const gjeldendeOppfolgingsperiode = mockOppfolging.oppfolgingsPerioder.find((it) => !erHistorisk(it));
const gammelOppfolgingsperiode = mockOppfolging.oppfolgingsPerioder.find((it) =>
    erHistorisk(it),
) as HistoriskOppfolgingsperiode;

const arenaAktivitet = {
    ...arenaMockAktiviteter[0],
    tittel: 'Arenaaktivitet',
    id: 'ARENATA11',
    oppfolgingsperiodeId: gjeldendeOppfolgingsperiode?.uuid,
};
const gammelArenaAktivitet = {
    ...arenaMockAktiviteter[0],
    tittel: 'Gammel Arenaaktivitet',
    id: 'ARENATA22',
    opprettetDato: '2017-02-30T10:46:10.971+01:00', // I gammel oppfølgingsperiode
    oppfolgingsperiodeId: gammelOppfolgingsperiode.uuid,
};
// Start nyeste periode '2018-01-31T10:46:10.971+01:00',
const arenaAktivitetUtenforPeriode = {
    ...arenaMockAktiviteter[0],
    tittel: 'Aktivitet utenfor perioder',
    id: 'ARENATA33',
    opprettetDato: '2018-01-02T10:46:10.971+01:00', // I mellom periodene
};
const arenaAktivitetForOppfolging = {
    ...arenaMockAktiviteter[0],
    tittel: 'Aktivitet før all oppfolging',
    id: 'ARENATA44',
    opprettetDato: '2017-01-01T10:46:10.971+01:00', // Før alle periodene
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
    oppfolgingsperiodeId: gammelOppfolgingsperiode.uuid,
};

const initialStore = {
    data: {
        ...emptyLoadedVeilederState.data,
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
            data: [arenaAktivitet, gammelArenaAktivitet, arenaAktivitetUtenforPeriode],
        },
        oppfolging: {
            status: Status.OK,
            data: mockOppfolging,
        },
    },
} as unknown as RootState;

// Overstyr lesing av aktiviteter i denne testen
const server = setupServer(
    rest.post(
        '/veilarbaktivitet/graphql',
        failOrGrahpqlResponse(
            () => false,
            () => aktivitestplanResponse({ aktiviteter: [veilarbAktivitet, gammelVeilarbAktivitet] }),
        ),
    ),
    rest.get(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGrahpqlResponse(
            () => false,
            () => [arenaAktivitet, gammelArenaAktivitet, arenaAktivitetUtenforPeriode],
        ),
    ),
    ...handlers,
);
describe('PeriodeFilter.tsx', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    describe('Veilarbaktivitet filtrering', () => {
        it('skal vise veilarb-aktivitet i nåværende periode (første i listen)', async () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Veilarbaktivitet'));
            expect(queryByText('Gammel Veilarbaktivitet')).not.toBeTruthy();
        });
        it('skal vise veilarb-aktivitet i tidligere periode', async () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { getByText, queryByText, getByLabelText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Periode'));
            await userEvent.selectOptions(getByLabelText('Periode'), '30. Jan 2017 - 31. Dec 2017');
            getByText('Gammel Veilarbaktivitet');
            expect(queryByText('Veilarbaktivitet')).not.toBeTruthy();
        });
    });

    describe('Arenaaktivitet filtrering', () => {
        it('skal vise arena-ativitet i nåværende periode (første i listen)', async () => {
            const store = configureStore({ reducer, preloadedState: initialStore });
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Arenaaktivitet'));
            expect(queryByText('Gammel Arenaaktivitet')).not.toBeTruthy();
        });
        it('skal vise arena-aktivitet i tidligere periode', async () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { getByText, queryByText, getByLabelText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Periode'));
            await userEvent.selectOptions(getByLabelText('Periode'), '30. Jan 2017 - 31. Dec 2017');
            getByText('Gammel Arenaaktivitet');
            expect(queryByText('Arenaaktivitet')).not.toBeTruthy();
        });
        it('skal vise aktivitet endret før siste oppfølginsperiode men etter tidligere oppfølgingsperiode i siste oppfølgingsperode', async () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { getByText } = render(<WrappedHovedside store={store} />);
            waitFor(() => getByText(arenaAktivitetUtenforPeriode.tittel));
        });
        it('skal ikke vise aktivitet endret før oppfølging i noen av periodene', async () => {
            const store = configureStore({
                reducer,
                preloadedState: initialStore,
            });
            const { queryByText, getByLabelText, getByText } = render(<WrappedHovedside store={store} />);
            expect(queryByText(arenaAktivitetForOppfolging.tittel)).not.toBeTruthy();
            await waitFor(() => getByText('Periode'));
            await userEvent.selectOptions(getByLabelText('Periode'), '30. Jan 2017 - 31. Dec 2017');
            expect(queryByText(arenaAktivitetForOppfolging.tittel)).not.toBeTruthy();
        });
        describe('datoErIPeriode-filter', () => {
            const gammelOpprettetDato = gammelArenaAktivitet.opprettetDato;
            const currentOpprettetDato = arenaAktivitet.opprettetDato;
            const gammelPeriodeSlutt = gammelOppfolgingsperiode.sluttDato;
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
