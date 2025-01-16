/* Provide both redux-store and "in-memory" router for all sub-components to render correctly */
import React from 'react';
import { arenaMockAktiviteter } from '../../../mocks/data/arena';
import { render, waitFor } from '@testing-library/react';
import { configureStore, EntityState } from '@reduxjs/toolkit';
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
import { emptyHalfLoadedVeilederState } from '../../../testUtils/defaultInitialStore';
import { rest } from 'msw';
import { failOrGrahpqlResponse, mockfnr } from '../../../mocks/utils';
import { aktivitetAdapter, oppfolgingsdperiodeAdapter, PeriodeEntityState } from '../../aktivitet/aktivitet-slice';
import { compareDesc } from 'date-fns';
import { mockLoadedStore } from '../../../testUtils/storeMockUtils';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';

const perioder = mockOppfolging.oppfolgingsPerioder.toSorted((a, b) => {
    return compareDesc(a.startDato, b.startDato);
});
const gjeldendeOppfolgingsperiode = perioder.find((it) => !erHistorisk(it))!!; // NOSONAR
const gammelOppfolgingsperiode = perioder.find((it) => erHistorisk(it)) as HistoriskOppfolgingsperiode;
const endaGamlerePeriode = perioder[2];

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
    oppfolgingsperiodeId: gjeldendeOppfolgingsperiode.uuid,
};
const gammelVeilarbAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: 'Gammel Veilarbaktivitet',
    id: '2',
    oppfolgingsperiodeId: gammelOppfolgingsperiode.uuid,
};
const endaGamlereAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: 'Enda gamlere Veilarbaktivitet',
    id: '4',
    oppfolgingsperiodeId: endaGamlerePeriode.uuid,
};

const aktiviteterIBareLukkedePerioder = (): VeilarbAktivitet[] => {
    return [endaGamlereAktivitet, gammelVeilarbAktivitet];
    // const state = oppfolgingsdperiodeAdapter.getInitialState({
    //     status: Status.OK,
    // });
    // const perioder = oppfolgingsdperiodeAdapter.setAll(state, [
    //     {
    //         id: endaGamlereAktivitet.oppfolgingsperiodeId,
    //         aktiviteter: aktivitetAdapter.upsertOne(aktivitetAdapter.getInitialState(), endaGamlereAktivitet),
    //         start: endaGamlerePeriode.startDato,
    //         slutt: endaGamlerePeriode.sluttDato,
    //     },
    //     {
    //         id: gammelVeilarbAktivitet.oppfolgingsperiodeId,
    //         aktiviteter: aktivitetAdapter.upsertOne(aktivitetAdapter.getInitialState(), gammelVeilarbAktivitet),
    //         start: gammelOppfolgingsperiode.startDato,
    //         slutt: gammelOppfolgingsperiode.sluttDato,
    //     },
    // ]);
    // return perioder;
};

const aktiviteterÅpenOgLukketPeriode = (): VeilarbAktivitet[] => {
    return [veilarbAktivitet, gammelVeilarbAktivitet];
    // const state = oppfolgingsdperiodeAdapter.getInitialState({
    //     status: Status.OK,
    // });
    // return oppfolgingsdperiodeAdapter.setAll(state, [
    //     {
    //         id: veilarbAktivitet.oppfolgingsperiodeId,
    //         aktiviteter: aktivitetAdapter.upsertOne(aktivitetAdapter.getInitialState(), veilarbAktivitet),
    //         start: gjeldendeOppfolgingsperiode.startDato,
    //         slutt: undefined,
    //     },
    //     {
    //         id: gammelVeilarbAktivitet.oppfolgingsperiodeId,
    //         aktiviteter: aktivitetAdapter.upsertOne(aktivitetAdapter.getInitialState(), gammelVeilarbAktivitet),
    //         start: gammelOppfolgingsperiode.startDato,
    //         slutt: gammelOppfolgingsperiode.sluttDato,
    //     },
    // ]);
};

const initialStore = (aktiviteter: VeilarbAktivitet[]): RootState =>
    mockLoadedStore({
        aktiviteter,
        arenaAktiviteter: [arenaAktivitet, gammelArenaAktivitet, arenaAktivitetUtenforPeriode],
    });
// {
//     data: {
//         ...emptyHalfLoadedVeilederState.data,
//         aktiviteter,
//         arenaAktiviteter: {
//             status: Status.OK,
//             data: [arenaAktivitet, gammelArenaAktivitet, arenaAktivitetUtenforPeriode],
//         },
//         oppfolging: {
//             status: Status.OK,
//             data: mockOppfolging,
//         },
//     },
// }) as unknown as RootState;

const lagStore = (initialStore: RootState) =>
    configureStore({
        reducer,
        preloadedState: initialStore,
    });

const gitt = {
    aktiviteterÅpenOgLukketPeriode: () => lagStore(initialStore(aktiviteterÅpenOgLukketPeriode())),
    aktiviteterIBareLukkedePerioder: () => lagStore(initialStore(aktiviteterIBareLukkedePerioder())),
};

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

const gammelPeriodeDropdownTekst = '30. Jan 2017 - 31. Dec 2017';

describe('PeriodeFilter.tsx', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    describe('Veilarbaktivitet filtrering', () => {
        it('skal vise veilarb-aktivitet i nåværende periode (første i listen)', async () => {
            const store = gitt.aktiviteterÅpenOgLukketPeriode();
            const { getByText, queryByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Veilarbaktivitet'));
            expect(queryByText('Gammel Veilarbaktivitet')).toBeFalsy();
        });
        it('skal vise veilarb-aktivitet i tidligere periode', async () => {
            const store = gitt.aktiviteterÅpenOgLukketPeriode();
            const { getByText, queryByText, getByLabelText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Periode'));
            await userEvent.selectOptions(getByLabelText('Periode'), gammelPeriodeDropdownTekst);
            getByText(gammelVeilarbAktivitet.tittel);
            expect(queryByText(veilarbAktivitet.tittel)).toBeFalsy();
        });
    });

    describe('Arenaaktivitet filtrering', () => {
        it('skal vise arena-ativitet i nåværende periode (første i listen)', async () => {
            const store = gitt.aktiviteterÅpenOgLukketPeriode();
            const { getByText, queryByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText(arenaAktivitet.tittel));
            expect(queryByText(gammelArenaAktivitet.tittel)).toBeFalsy();
        });
        it('skal vise arena-aktivitet i tidligere periode', async () => {
            const store = gitt.aktiviteterÅpenOgLukketPeriode();
            const { getByText, queryByText, getByLabelText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Periode'));
            await userEvent.selectOptions(getByLabelText('Periode'), gammelPeriodeDropdownTekst);
            getByText(gammelArenaAktivitet.tittel);
            expect(queryByText(arenaAktivitet.tittel)).toBeFalsy();
        });
        it('skal ikke vise aktivitet endret før siste oppfølginsperiode men etter tidligere oppfølgingsperiode i siste oppfølgingsperode', async () => {
            const store = gitt.aktiviteterÅpenOgLukketPeriode();
            const { queryByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            expect(queryByText(arenaAktivitetUtenforPeriode.tittel)).toBeFalsy();
        });
        it('skal ikke vise aktivitet endret før oppfølging i noen av periodene', async () => {
            const store = gitt.aktiviteterÅpenOgLukketPeriode();
            const { queryByText, getByLabelText, getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            expect(queryByText(arenaAktivitetForOppfolging.tittel)).not.toBeTruthy();
            await waitFor(() => getByText('Periode'));
            await userEvent.selectOptions(getByLabelText('Periode'), gammelPeriodeDropdownTekst);
            expect(queryByText(arenaAktivitetForOppfolging.tittel)).not.toBeTruthy();
        });
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

    describe('Default oppfolgingsperiode', () => {
        it('hvis det finnes en gjeldende periode skal aktiviteter i denne vises', async () => {
            const store = gitt.aktiviteterÅpenOgLukketPeriode();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText(veilarbAktivitet.tittel));
        });
        it('hvis bare lukkede perioder skal aktiviteter i nyeste periode vises', async () => {
            const store = gitt.aktiviteterIBareLukkedePerioder();
            const { getByText, queryByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText(gammelVeilarbAktivitet.tittel));
            expect(queryByText(endaGamlereAktivitet.tittel)).not.toBeTruthy();
        });
    });
});
