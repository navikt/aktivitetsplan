import { beforeAll, describe, expect, Mock } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../../testUtils/WrappedHovedside';
import { mockfnr } from '../../../mocks/utils';
import React from 'react';
import { defaultAktivPeriode } from '../../../testUtils/store/defaultInitialStore';
// import { setupServer } from 'msw/node';
// import { handlers } from '../../../mocks/handlers';
import { lagNyAktivitet } from '../aktivitet-actions';
import { gitt } from '../../../testUtils/store/mockStoreBuilder';
import { DialogResponse } from '../../../api/dialogGraphql';
import { aktivitetingress } from '../visning/aktivitetingress/AktivitetIngress';

// const server = setupServer(...handlers);

vi.mock('../aktivitet-actions', { spy: true });

vi.mock('../../../api/dialogGraphql', () => ({
    hentDialogerGraphql: (): Promise<DialogResponse> =>
        Promise.resolve({
            data: {
                dialoger: [],
                stansVarsel: undefined,
            },
            errors: undefined,
        }),
}));

describe('ny aktivitet', () => {
    // Start server before all tests
    // beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    // afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    // afterEach(() => server.resetHandlers());

    it('Skal poste ny aktivitet til backend med riktig oppfolgingsperiode-id', async () => {
        const store = gitt().createStore();
        const routerRef: { current: any } = { current: undefined };
        const { getByText, getByLabelText, getByRole, findByText, queryByText } = render(
            <WrappedHovedside fnr={mockfnr} store={store} routerRef={routerRef} />,
        );
        const leggTilKnapp = await waitFor(() => getByRole('button', { name: /Legg til aktivitet/i }));
        await waitFor(() => {
            expect(leggTilKnapp).not.toBeDisabled();
        });
        act(() => leggTilKnapp.click());

        const samtaleReferatMenyValg = getByRole('button', { name: /Samtalereferat/i });
        fireEvent.click(samtaleReferatMenyValg);
        await waitFor(() => {
            expect(routerRef.current?.state.location.pathname).toBe('/aktivitetsplan/aktivitet/ny/samtalereferat');
        });

        await waitFor(() => {
            expect(getByText(aktivitetingress.SAMTALEREFERAT)).toBeInTheDocument();
        });
        const tittel = 'Hei';

        const temaFelt = getByLabelText('Tema for samtalen (obligatorisk)');
        expect(temaFelt).toBeInTheDocument();
        await act(() => fireEvent.change(temaFelt, { target: { value: tittel } }));

        const datoInput = getByLabelText('Dato (obligatorisk)');
        expect(datoInput).toBeInTheDocument();
        await act(() => fireEvent.change(datoInput, { target: { value: '01.12.24' } }));

        await act(() => fireEvent.click(getByText('Lagre utkast')));
        const warning = await queryByText('For å gå videre må du rette opp følgende:');
        expect(await warning).not.toBeInTheDocument();
        expect((lagNyAktivitet as unknown as Mock).mock.calls).toHaveLength(1);
        const callPayload = (lagNyAktivitet as unknown as Mock).mock.calls[0][0];
        expect(callPayload).toMatchObject({
            aktivitet: {
                avtalt: false,
                erReferatPublisert: false,
                kanal: 'TELEFON',
                referat: '\nHilsen Fornavn Etternavn',
                status: 'GJENNOMFORES',
                tittel,
                type: 'SAMTALEREFERAT',
            },
            oppfolgingsPeriodeId: defaultAktivPeriode.id,
        });
    });
});
