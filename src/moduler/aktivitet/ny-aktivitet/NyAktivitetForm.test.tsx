import { beforeAll, describe, expect, Mock } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../../testUtils/WrappedHovedside';
import { mockfnr } from '../../../mocks/utils';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import reducer from '../../../reducer';
import { aktivitetAdapter, oppfolgingsdperiodeAdapter } from '../aktivitet-slice';
import { defaultAktivPeriode, emptyHalfLoadedVeilederState } from '../../../testUtils/defaultInitialStore';
import { Status } from '../../../createGenericSlice';
import { oppfolgingGraphql } from '../../../mocks/data/oppfolging';
import { setupServer } from 'msw/node';
import { handlers } from '../../../mocks/handlers';
import { lagNyAktivitet } from '../aktivitet-actions';
import { ReadWriteMode } from '../../../utils/readOrWriteModeSlice';

const initialStore = {
    view: {
        readOrWriteMode: { mode: ReadWriteMode.WRITE },
    },
    data: {
        ...emptyHalfLoadedVeilederState.data,
        aktiviteter: oppfolgingsdperiodeAdapter.setOne(
            oppfolgingsdperiodeAdapter.getInitialState({
                status: Status.NOT_STARTED,
            }),
            { ...defaultAktivPeriode, aktiviteter: aktivitetAdapter.getInitialState() },
        ),
        arenaAktiviteter: {
            status: Status.OK,
            data: [],
        },
        oppfolging: {
            status: Status.OK,
            data: oppfolgingGraphql,
        },
    },
} as unknown as RootState;

const lagStore = (initialStore: RootState) => {
    return configureStore({
        reducer,
        preloadedState: initialStore,
    });
};

const gitt = {
    // Preserves the active oppfolgingsperiode (required by NyAktivitetForm) but with no activities and Status.OK
    tomAktivOppfolgingsPeriode: () =>
        lagStore({
            ...initialStore,
            data: {
                ...initialStore.data,
                aktiviteter: oppfolgingsdperiodeAdapter.setOne(
                    oppfolgingsdperiodeAdapter.getInitialState({ status: Status.OK }),
                    { ...defaultAktivPeriode, aktiviteter: aktivitetAdapter.getInitialState() },
                ),
            },
        }),
};

const server = setupServer(...handlers);

vi.mock('../aktivitet-actions', { spy: true });

describe('ny aktivitet', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    it('Skal poste ny aktivitet til backend med riktig oppfolgingsperiode-id', async () => {
        const store = gitt.tomAktivOppfolgingsPeriode();
        const routerRef: { current: any } = { current: undefined };
        const { getByText, getByLabelText, getByRole, findByText, findByRole } = render(
            <WrappedHovedside fnr={mockfnr} store={store} routerRef={routerRef} />,
        );
        const leggTilKnapp = await waitFor(() => getByRole('button', { name: /Legg til aktivitet/i }));
        await waitFor(() => {
            expect(leggTilKnapp).not.toBeDisabled();
        });
        await act(() => fireEvent.click(leggTilKnapp));

        const samtaleReferatMenyValg = getByRole('button', { name: /Samtalereferat/i });
        await act(() => fireEvent.click(samtaleReferatMenyValg));

        await waitFor(() => {
            expect(routerRef.current?.state.location.pathname).toBe('/aktivitetsplan/aktivitet/ny/samtalereferat');
        });

        await findByText(/Her finner du referat fra en samtale du har hatt med Nav/);
        const tittel = 'Hei';

        const temaFelt = getByLabelText('Tema for samtalen (obligatorisk)');
        expect(temaFelt).toBeInTheDocument();
        fireEvent.change(temaFelt, { target: { value: tittel } });

        const datoInput = getByLabelText('Dato (obligatorisk)');
        expect(datoInput).toBeInTheDocument();
        await act(() => fireEvent.change(datoInput, { target: { value: '01.12.24' } }));

        await act(() => fireEvent.click(getByText('Lagre utkast')));
        expect((lagNyAktivitet as unknown as Mock).mock.calls).toHaveLength(1);
        const callPayload = (lagNyAktivitet as unknown as Mock).mock.calls[0][0];
        expect(callPayload).toMatchObject({
            aktivitet: {
                avtalt: false,
                erReferatPublisert: false,
                kanal: 'TELEFON',
                referat: '\nHilsen Røde Ruben',
                status: 'GJENNOMFORES',
                tittel,
                type: 'SAMTALEREFERAT',
            },
            oppfolgingsPeriodeId: defaultAktivPeriode.id,
        });
    });
});
