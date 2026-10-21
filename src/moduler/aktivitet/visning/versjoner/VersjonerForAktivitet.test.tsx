import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { ErVeilederContext } from '../../../../Provider';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { AktivitetsId, AktivitetsVersjon, OppfolgingsPeriodeId } from '../../../../datatypes/brandedTypes';
import { Endring } from '../../../../datatypes/Historikk';
import { EgenAktivitet, MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { enEgenAktivitet } from '../../../../mocks/fixtures/egenAktivitet';
import { enMoteAktivitet } from '../../../../mocks/fixtures/moteAktivitetFixtures';
import { enSamtalereferatAktivitet } from '../../../../mocks/fixtures/samtalereferatFixtures';
import { gitt } from '../../../../testUtils/store/mockStoreBuilder';
import VersjonerForAktivitet from './VersjonerForAktivitet';

const aktivitetId = 'aktivitet-1' as AktivitetsId;
const oppfolgingsperiodeId = 'a2aa22a2-2aa2-4e02-8cc2-d44ef605fa33' as OppfolgingsPeriodeId;

const lagEndring = (beskrivelse: string, versjonsId: AktivitetsVersjon, tidspunkt: string): Endring => ({
    endretAvType: 'NAV',
    endretAv: 'Z123456',
    tidspunkt,
    beskrivelseForVeileder: beskrivelse,
    beskrivelseForBruker: beskrivelse,
    versjonsId,
});

const renderVersjoner = async ({
    aktivitet,
    endringer,
    erBruker,
}: {
    aktivitet: SamtalereferatAktivitet | MoteAktivitet | EgenAktivitet;
    endringer: Endring[];
    erBruker: boolean;
}) => {
    const aktivitetMedHistorikk = {
        ...aktivitet,
        id: aktivitetId,
        oppfolgingsperiodeId,
        historikk: { endringer },
    };
    const store = gitt()
        .aktiviteter.medAktivitet(aktivitetMedHistorikk as unknown as SamtalereferatAktivitet)
        .createStore();
    const router = createMemoryRouter(
        [
            {
                id: 'aktivitetsVisning',
                path: '/aktivitet/vis/:id',
                hydrateFallbackElement: <div></div>,
                loader: () => ({
                    aktivitet: Promise.resolve({
                        payload: {
                            data: {
                                aktivitet: aktivitetMedHistorikk,
                            },
                        },
                    }),
                }),
                element: <VersjonerForAktivitet />,
            },
        ],
        {
            initialEntries: [`/aktivitet/vis/${aktivitetId}`],
        },
    );

    render(
        <ErVeilederContext value={!erBruker}>
            <ReduxProvider store={store}>
                <RouterProvider router={router} />
            </ReduxProvider>
        </ErVeilederContext>,
    );
};

describe('VersjonerForAktivitet', () => {
    it('skal ikke vise lenke på siste endring selv om det er referatendring', async () => {
        const aktivitet = enSamtalereferatAktivitet({ id: aktivitetId, oppfolgingsperiodeId });
        const endringer = [
            lagEndring('Nav endret referatet', '2' as AktivitetsVersjon, '2026-08-20T12:00:00.000Z'),
            lagEndring('Nav endret referatet', '1' as AktivitetsVersjon, '2026-08-20T11:00:00.000Z'),
        ];

        await renderVersjoner({ aktivitet, endringer, erBruker: false });

        expect(await screen.findAllByText('Se tidligere versjon av referatet')).toHaveLength(1);
    });

    it('skal vise lenke for første versjon av samtalereferat', async () => {
        const aktivitet = enSamtalereferatAktivitet({ id: aktivitetId, oppfolgingsperiodeId });
        const endringer = [
            lagEndring('Nav endret detaljer på aktiviteten', '2' as AktivitetsVersjon, '2026-08-20T12:00:00.000Z'),
            lagEndring('Nav opprettet aktivitet', '1' as AktivitetsVersjon, '2026-08-20T11:00:00.000Z'),
        ];

        await renderVersjoner({ aktivitet, endringer, erBruker: false });

        expect(await screen.findAllByText('Se tidligere versjon av referatet')).toHaveLength(1);
    });

    it('skal ikke vise lenke for første versjon av møte', async () => {
        const aktivitet = enMoteAktivitet({
            id: aktivitetId,
            oppfolgingsperiodeId,
            status: AktivitetStatus.GJENNOMFOERT,
        });
        const endringer = [
            lagEndring('Nav endret detaljer på aktiviteten', '2' as AktivitetsVersjon, '2026-08-20T12:00:00.000Z'),
            lagEndring('Nav opprettet aktivitet', '1' as AktivitetsVersjon, '2026-08-20T11:00:00.000Z'),
        ];

        await renderVersjoner({ aktivitet, endringer, erBruker: false });

        expect(screen.queryByText('Se tidligere versjon av referatet')).not.toBeInTheDocument();
    });

    it('skal bare vise lenke for riktige aktivitetstyper', async () => {
        const aktivitet = enEgenAktivitet({
            id: aktivitetId,
            tittel: 'Egen aktivitet',
            oppfolgingsperiodeId,
        });
        const endringer = [
            lagEndring('Nav opprettet referat', '2' as AktivitetsVersjon, '2026-08-20T12:00:00.200Z'),
            lagEndring('Nav endret referat', '1' as AktivitetsVersjon, '2026-08-20T11:00:00.100Z'),
        ];

        await renderVersjoner({ aktivitet, endringer, erBruker: false });

        expect(screen.queryByText('Se tidligere versjon av referatet')).not.toBeInTheDocument();
    });

    it('skal IKKE vise bruker versjoner som ikke er publisert for bruker', async () => {
        const aktivitet = enMoteAktivitet({
            id: aktivitetId,
            tittel: 'Møtt',
            oppfolgingsperiodeId,
        });
        const endringer = [
            lagEndring('Nav endret referatet', '5' as AktivitetsVersjon, '2026-08-20T11:00:00.300Z'),
            lagEndring('Nav delte referatet', '4' as AktivitetsVersjon, '2026-08-20T11:00:00.300Z'),
            lagEndring('Nav endret referatet', '3' as AktivitetsVersjon, '2026-08-20T11:00:00.400Z'),
            lagEndring('Nav opprettet referat', '2' as AktivitetsVersjon, '2026-08-20T11:00:00.200Z'),
            lagEndring('Nav opprettet mote', '1' as AktivitetsVersjon, '2026-08-20T12:00:00.100Z'),
        ];

        await renderVersjoner({ aktivitet, endringer, erBruker: true });

        const element = await screen.findByText('Se tidligere versjon av referatet');
        expect(element).toBeInTheDocument();
        const link = element.parentElement;
        expect(link!).toHaveProperty('href');
        expect((link as HTMLAnchorElement).href).toContain('http://localhost:3000/aktivitet/vis/aktivitet-1/versjon/4');
    });

    it('skal vise bruker versjoner som ikke er publisert for veileder', async () => {
        const aktivitet = enMoteAktivitet({
            id: aktivitetId,
            tittel: 'Møtt',
            oppfolgingsperiodeId,
        });
        const endringer = [
            lagEndring('Nav endret referatet', '5' as AktivitetsVersjon, '2026-08-20T11:00:00.500Z'),
            lagEndring('Nav endret referatet', '4' as AktivitetsVersjon, '2026-08-20T11:00:00.400Z'),
            lagEndring('Nav delte referatet', '3' as AktivitetsVersjon, '2026-08-20T11:00:00.300Z'),
            lagEndring('Nav opprettet referat', '2' as AktivitetsVersjon, '2026-08-20T11:00:00.200Z'),
            lagEndring('Nav opprettet mote', '1' as AktivitetsVersjon, '2026-08-20T12:00:00.100Z'),
        ];

        await renderVersjoner({ aktivitet, endringer, erBruker: false });

        const elements = await screen.findAllByText('Se tidligere versjon av referatet');
        expect(elements).toHaveLength(3);
    });
});
