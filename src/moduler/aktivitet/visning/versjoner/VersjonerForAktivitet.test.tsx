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

const lagEndring = (beskrivelse: string, versjonsId: string, tidspunkt: string): Endring => ({
    endretAvType: 'NAV',
    endretAv: 'Z123456',
    tidspunkt,
    beskrivelseForVeileder: beskrivelse,
    beskrivelseForBruker: beskrivelse,
    versjonsId: versjonsId as AktivitetsVersjon,
});

const renderVersjoner = async ({
    aktivitet,
    endringer,
}: {
    aktivitet: SamtalereferatAktivitet | MoteAktivitet | EgenAktivitet;
    endringer: Endring[];
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
        <ErVeilederContext value={true}>
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
            lagEndring('Nav endret referat', '2', '2026-08-20T12:00:00.000Z'),
            lagEndring('Nav endret referat', '1', '2026-08-20T11:00:00.000Z'),
        ];

        await renderVersjoner({ aktivitet, endringer });

        expect(await screen.findAllByText('Se tidligere versjon')).toHaveLength(1);
    });

    it('skal vise lenke for første versjon av samtalereferat', async () => {
        const aktivitet = enSamtalereferatAktivitet({ id: aktivitetId, oppfolgingsperiodeId });
        const endringer = [
            lagEndring('Nav endret detaljer på aktiviteten', '2', '2026-08-20T12:00:00.000Z'),
            lagEndring('Nav opprettet aktivitet', '1', '2026-08-20T11:00:00.000Z'),
        ];

        await renderVersjoner({ aktivitet, endringer });

        expect(await screen.findAllByText('Se tidligere versjon')).toHaveLength(1);
    });

    it('skal ikke vise lenke for første versjon av møte', async () => {
        const aktivitet = enMoteAktivitet({
            id: aktivitetId,
            oppfolgingsperiodeId,
            status: AktivitetStatus.GJENNOMFOERT,
        });
        const endringer = [
            lagEndring('Nav endret detaljer på aktiviteten', '2', '2026-08-20T12:00:00.000Z'),
            lagEndring('Nav opprettet aktivitet', '1', '2026-08-20T11:00:00.000Z'),
        ];

        await renderVersjoner({ aktivitet, endringer });

        expect(screen.queryByText('Se tidligere versjon')).not.toBeInTheDocument();
    });

    it('skal bare vise lenke for riktige aktivitetstyper', async () => {
        const aktivitet = enEgenAktivitet({
            id: aktivitetId,
            tittel: 'Egen aktivitet',
            oppfolgingsperiodeId,
        });
        const endringer = [
            lagEndring('Nav opprettet referat', '2', '2026-08-20T12:00:00.000Z'),
            lagEndring('Nav endret referat', '1', '2026-08-20T11:00:00.000Z'),
        ];

        await renderVersjoner({ aktivitet, endringer });

        expect(screen.queryByText('Se tidligere versjon')).not.toBeInTheDocument();
    });
});
