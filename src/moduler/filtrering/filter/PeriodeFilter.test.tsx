import React from 'react';
import { arenaMockAktiviteter } from '../../../mocks/data/arena';
import { act, render, waitFor } from '@testing-library/react';
import { mockTestAktiviteter } from '../../../mocks/aktivitet';
import { defaultMockOppfolgingsPerioder } from '../../../mocks/data/oppfolging';
import userEvent from '@testing-library/user-event';
import { datoErIPeriode } from './filter-utils';
import { expect } from 'vitest';
import { erHistorisk, HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { WrappedHovedside } from '../../../testUtils/WrappedHovedside';
import { mockfnr } from '../../../mocks/utils';
import { compareDesc } from 'date-fns';
import { OppfolgingsPeriode } from '../../../api/veilarboppfolging';
import { AktivitetsId } from '../../../datatypes/brandedTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { gitt as storeBuilder } from '../../../testUtils/store/mockStoreBuilder';
import { ArenaAktivitet } from '../../../datatypes/arenaAktivitetTypes';

const perioder = defaultMockOppfolgingsPerioder.toSorted((a, b) => {
    return compareDesc(a.startTidspunkt, b.startTidspunkt);
});
const gjeldendeOppfolgingsperiode = perioder.find((it) => !erHistorisk(it))!!; // NOSONAR
const gamlePerioder = perioder.filter((it) => erHistorisk(it));
const gammelOppfolgingsperiode = gamlePerioder[0] as HistoriskOppfolgingsperiode & { startTidspunkt: string };
const endaGamlerePeriode = gamlePerioder[1] as HistoriskOppfolgingsperiode & { startTidspunkt: string };

const arenaAktivitet = {
    ...arenaMockAktiviteter[0],
    tittel: 'Arenaaktivitet',
    id: 'ARENATA11',
    oppfolgingsperiodeId: gjeldendeOppfolgingsperiode?.id,
};
const gammelArenaAktivitet = {
    ...arenaMockAktiviteter[0],
    tittel: 'Gammel Arenaaktivitet',
    id: 'ARENATA22',
    opprettetDato: '2017-02-30T10:46:10.971+01:00', // I gammel oppfølgingsperiode
    oppfolgingsperiodeId: gammelOppfolgingsperiode.id,
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
    id: '1' as AktivitetsId,
    oppfolgingsperiodeId: gjeldendeOppfolgingsperiode.id,
};
const gammelVeilarbAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: 'Gammel Veilarbaktivitet',
    id: '2' as AktivitetsId,
    oppfolgingsperiodeId: gammelOppfolgingsperiode.id,
};
const endaGamlereAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: 'Enda gamlere Veilarbaktivitet',
    id: '4' as AktivitetsId,
    oppfolgingsperiodeId: endaGamlerePeriode.id,
};
type Mockargs = {
    aktiviteter: VeilarbAktivitet[];
    perioder: (OppfolgingsPeriode & { startTidspunkt: string })[];
    arenaAktiviteter: ArenaAktivitet[];
};
const aktiviteterIBareLukkedePerioder = (): Mockargs => {
    const oppfolgingsPerioder = [gammelOppfolgingsperiode, endaGamlerePeriode];
    return {
        aktiviteter: [endaGamlereAktivitet, gammelVeilarbAktivitet],
        perioder: oppfolgingsPerioder,
        arenaAktiviteter: [arenaAktivitet, gammelArenaAktivitet, arenaAktivitetUtenforPeriode],
    };
};

const aktiviteterÅpenOgLukketPeriode = (): Mockargs => {
    const oppfolgingsPerioder = [gjeldendeOppfolgingsperiode, gammelOppfolgingsperiode];
    return {
        aktiviteter: [veilarbAktivitet, gammelVeilarbAktivitet],
        perioder: oppfolgingsPerioder,
        arenaAktiviteter: [arenaAktivitet, gammelArenaAktivitet, arenaAktivitetUtenforPeriode],
    };
};

const gitt = {
    aktiviteterÅpenOgLukketPeriode: () =>
        storeBuilder()
            .aktivteterOgPerioder({ ...aktiviteterÅpenOgLukketPeriode() })
            .createStore(),
    aktiviteterIBareLukkedePerioder: () =>
        storeBuilder()
            .aktivteterOgPerioder({ ...aktiviteterIBareLukkedePerioder() })
            .createStore(),
};

const gammelPeriodeDropdownTekst = '30. Jan 2017 - 31. Dec 2017';

describe('PeriodeFilter.tsx', () => {
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
            const { queryByText } = await act(() => render(<WrappedHovedside fnr={mockfnr} store={store} />));
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
        const gammelPeriodeSlutt = gammelOppfolgingsperiode.sluttTidspunkt;
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
