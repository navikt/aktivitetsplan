import { render, fireEvent, act } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { EnhancedStore } from '@reduxjs/toolkit';
import React from 'react';
import { describe, it, expect, vi, Mock } from 'vitest';

import { ErVeilederContext } from '../../../Provider';
import { RootState } from '../../../store/rootReducer';
import { gitt } from '../../../testUtils/store/mockStoreBuilder';
import { aktivVeilarbOppfolgingMockPeriode } from '../../../testUtils/store/defaultInitialStore';
import { enEgenAktivitet } from '../../../mocks/fixtures/egenAktivitet';
import { enMoteAktivitet } from '../../../mocks/fixtures/moteAktivitetFixtures';
import { AktivitetsId, OppfolgingsPeriodeId } from '../../../datatypes/brandedTypes';
import AvbrytAktivitet from './AvbrytAktivitet';
import { avbrytAktivitet } from '../aktivitet-actions';
import { oppdaterAktivitetStatus } from '../../../api/aktivitetAPI';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';

vi.mock('../../../api/aktivitetAPI', { spy: true });

const aktivitetId = '1' as AktivitetsId;
const periodeId = aktivVeilarbOppfolgingMockPeriode.id as OppfolgingsPeriodeId;

const ikkeAvtaltAktivitet = enEgenAktivitet({
    id: aktivitetId,
    tittel: 'Test aktivitet',
    oppfolgingsperiodeId: periodeId,
});
const avtaltAktivitet = { ...ikkeAvtaltAktivitet, avtalt: true };
const moteAktivitet = { ...enMoteAktivitet(), id: aktivitetId, oppfolgingsperiodeId: periodeId };
const samtalereferatAktivitet = {
    ...enMoteAktivitet(),
    id: aktivitetId,
    oppfolgingsperiodeId: periodeId,
    type: 'SAMTALEREFERAT' as const,
    erReferatPublisert: false,
};

const lagRouter = (id: string = aktivitetId) =>
    createMemoryRouter(
        [
            { path: '/', element: <div>Hjemside</div> },
            { path: '/:id', element: <AvbrytAktivitet />, loader: () => ({}) },
        ],
        { initialEntries: [`/${id}`] },
    );

const renderAvbrytAktivitet = (store: EnhancedStore<RootState>, erVeileder = false) => {
    const router = lagRouter();
    return render(
        <ErVeilederContext value={erVeileder}>
            <ReduxProvider store={store}>
                <RouterProvider router={router} />
            </ReduxProvider>
        </ErVeilederContext>,
    );
};

describe('AvbrytAktivitet', () => {
    it('skal vise modal-overskrift "Avbryt aktivitet" for gyldig aktivitet', async () => {
        const store = gitt().aktiviteter.medAktivitet(ikkeAvtaltAktivitet).createStore();
        const { findByText, queryByText } = renderAvbrytAktivitet(store);
        await findByText('Avbryt aktivitet');
        expect(queryByText(/Skriv en kort begrunnelse/)).not.toBeInTheDocument();
    });

    it('skal vise advarsel og Lagre-knapp (VisAdvarsel) for ikke-avtalt aktivitet', async () => {
        const store = gitt().aktiviteter.medAktivitet(ikkeAvtaltAktivitet).createStore();
        const { findByText, queryByText } = renderAvbrytAktivitet(store);
        await findByText(/Når du lagrer, blir aktiviteten låst/);
        await findByText('Lagre');
        expect(queryByText(/Skriv en kort begrunnelse/)).not.toBeInTheDocument();
    });

    it('skal vise BegrunnelseForm for avtalt aktivitet', async () => {
        const store = gitt().aktiviteter.medAktivitet(avtaltAktivitet).createStore();
        const { findByLabelText, findByText } = renderAvbrytAktivitet(store);
        await findByLabelText('Begrunnelse');
        await findByText(/Skriv en kort begrunnelse/);
    });

    it('skal vise BegrunnelseForm for møte-aktivitet (krever begrunnelse ved avbrudd)', async () => {
        const store = gitt().aktiviteter.medAktivitet(moteAktivitet).createStore();
        const { findByLabelText } = renderAvbrytAktivitet(store);
        await findByLabelText('Begrunnelse');
    });

    it('skal navigere til hjemside når aktivitet ikke finnes i store', async () => {
        const store = gitt().createStore();
        const router = createMemoryRouter(
            [
                { path: '/', element: <div>Hjemside</div> },
                { path: '/:id', element: <AvbrytAktivitet />, loader: () => ({}) },
            ],
            { initialEntries: ['/ikke-eksisterende-id'] },
        );
        const { findByText } = render(
            <ErVeilederContext value={false}>
                <ReduxProvider store={store}>
                    <RouterProvider router={router} />
                </ReduxProvider>
            </ErVeilederContext>,
        );
        await findByText('Hjemside');
    });

    it('skal kalle avbrytAktivitet uten begrunnelse ved innsending av VisAdvarsel', async () => {
        const store = gitt().aktiviteter.medAktivitet(ikkeAvtaltAktivitet).createStore();
        const { findByText } = renderAvbrytAktivitet(store);

        const lagreKnapp = await findByText('Lagre');
        fireEvent.click(lagreKnapp);

        expect(oppdaterAktivitetStatus as unknown as Mock).toHaveBeenCalledWith({
            ...ikkeAvtaltAktivitet,
            status: AktivitetStatus.AVBRUTT,
            avsluttetKommentar: undefined,
        });
    });

    it('skal kalle avbrytAktivitet med begrunnelsestekst ved innsending av BegrunnelseForm', async () => {
        const store = gitt().aktiviteter.medAktivitet(avtaltAktivitet).createStore();
        const { findByLabelText, findByText } = renderAvbrytAktivitet(store);

        const begrunnelseInput = await findByLabelText('Begrunnelse');
        fireEvent.change(begrunnelseInput, { target: { value: 'Jeg måtte avbryte på grunn av sykdom' } });

        const lagreKnapp = await findByText('Lagre');
        await act(() => fireEvent.click(lagreKnapp));

        expect(oppdaterAktivitetStatus as unknown as Mock).toHaveBeenCalledWith({
            ...avtaltAktivitet,
            status: AktivitetStatus.AVBRUTT,
            avsluttetKommentar: 'Jeg måtte avbryte på grunn av sykdom',
        });
    });

    it('skal vise valideringsfeil når BegrunnelseForm sendes inn uten tekst', async () => {
        const store = gitt().aktiviteter.medAktivitet(avtaltAktivitet).createStore();
        const { findByText } = renderAvbrytAktivitet(store);

        const lagreKnapp = await findByText('Lagre');
        act(() => {
            fireEvent.click(lagreKnapp);
        });

        await findByText('Du må fylle ut begrunnelse');
    });

    it('skal vise advarsel om upublisert referat for samtalereferat', async () => {
        const store = gitt()
            .aktiviteter.medAktivitet(samtalereferatAktivitet as any)
            .createStore();
        const { findByText } = renderAvbrytAktivitet(store);
        await findByText(/Du må dele referatet med brukeren før du kan sette aktiviteten til fullført eller avbrutt/);
    });
});
