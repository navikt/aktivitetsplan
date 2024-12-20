import { beforeAll, describe, expect, Mock } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../../testUtils/WrappedHovedside';
import { mockfnr } from '../../../mocks/utils';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import reducer from '../../../reducer';
import { aktivitetAdapter, oppfolgingsdperiodeAdapter } from '../aktivitet-slice';
import { defaultAktivPeriode, emptyLoadedVeilederState } from '../../../testUtils/defaultInitialStore';
import { Status } from '../../../createGenericSlice';
import { mockOppfolging } from '../../../mocks/data/oppfolging';
import { setupServer } from 'msw/node';
import { handlers } from '../../../mocks/handlers';
import { rest } from 'msw';
import { opprettAktivitet } from '../../../mocks/aktivitet';
import { lagNyAktivitet } from '../aktivitet-actions';

const initialStore = {
    data: {
        ...emptyLoadedVeilederState.data,
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
            data: mockOppfolging,
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
    tomAktivOppfolgingsPeriode: () => lagStore(initialStore),
};

let nyePeriodeIder: string[] = [];

const server = setupServer(
    rest.post('/veilarbaktivitet/api/aktivitet/:periodeId/ny', async (req, res, ctx) => {
        nyePeriodeIder.push(req.params.periodeId);
        return res(ctx.json(await opprettAktivitet(req)));
    }),
    ...handlers,
);

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
        const { getByText, getByLabelText, findAllByText, queryByText } = render(
            <WrappedHovedside fnr={mockfnr} store={store} />,
        );
        const leggTilKnapp = await waitFor(() => getByText('Legg til aktivitet'));
        fireEvent.click(leggTilKnapp);
        await act(() => fireEvent.click(getByText('Samtalereferat')));
        const tittel = 'Hei';
        fireEvent.change(getByLabelText('Tema for samtalen (obligatorisk)'), {
            target: { value: tittel },
        });
        fireEvent.change(getByLabelText('Dato (obligatorisk)'), {
            target: { value: '01.12.24' },
        });
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
