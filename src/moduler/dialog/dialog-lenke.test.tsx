import { setupServer } from 'msw/node';
import { aktivitestplanResponse, handlers } from '../../mocks/handlers';
import { describe } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { emptyLoadedVeilederState } from '../../testUtils/defaultInitialStore';
import { rest } from 'msw';
import { failOrGrahpqlResponse, mockfnr } from '../../mocks/utils';
import { enEgenAktivitet } from '../../mocks/fixtures/egenAktivitet';
import { mockOppfolging } from '../../mocks/data/oppfolging';
import { erHistorisk } from '../../datatypes/oppfolgingTypes';
import dialoger from '../../mocks/data/dialog';
import { aktiviteterData } from '../../mocks/aktivitet';

const aktivitetIdErSomErMocket = aktiviteterData.aktiviteter.map((it) => it.id);
const currentOppfolgingsperiode = mockOppfolging.oppfolgingsPerioder.filter((periode) => !erHistorisk(periode))[0].uuid;
const aktivitetMedDialog = enEgenAktivitet({
    id: aktivitetIdErSomErMocket[0],
    tittel: 'Aktivitet med dialog',
    oppfolgingsperiodeId: currentOppfolgingsperiode,
});
const aktivitetUtenDialog = enEgenAktivitet({
    id: aktivitetIdErSomErMocket[1],
    tittel: 'Aktivitet uten dialog',
    oppfolgingsperiodeId: currentOppfolgingsperiode,
});
const testAktiviteter = [aktivitetMedDialog, aktivitetUtenDialog];
const testDialoger = [{ ...dialoger[0], aktivitetId: aktivitetIdErSomErMocket[0] }];

const server = setupServer(
    rest.post(
        '/veilarbaktivitet/graphql',
        failOrGrahpqlResponse(
            () => false,
            () => {
                return aktivitestplanResponse({ aktiviteter: testAktiviteter });
            },
        ),
    ),
    rest.post(
        '/veilarbdialog/graphql',
        failOrGrahpqlResponse(
            () => false,
            () => {
                return { data: { dialoger: testDialoger } };
            },
        ),
    ),
    ...handlers.filter((handler) => !(handler.info.path as string).includes('graphql')),
);
describe('Send melding knapp (Dialog lenker)', () => {
    let pushStateMock = vi.fn();
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    //  Close server after all tests
    afterAll(() => server.close());
    // Reset handlers after each test `important for test isolation`
    afterEach(() => {
        server.resetHandlers();
        pushStateMock.mockReset();
    });
    beforeEach(() => {
        Object.defineProperty(window.history, 'pushState', { value: pushStateMock });
        // pushStateMock = vi.spyOn(window.history, 'pushState');
        // vi.mock(window.history.pushState, () => pushStateMock);
    });

    describe('Veiledere:', () => {
        it('should use /:dialogId when there is dialog on aktivitet', async () => {
            const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => {
                getByText('Aktivitet med dialog');
            });
            await act(() => fireEvent.click(getByText('Aktivitet med dialog')));
            fireEvent.click(getByText('Send en melding'));
            expect(pushStateMock).toHaveBeenCalledWith('', 'Dialog', `/dialog/${testDialoger[0].id}`);
        });

        it('should use /ny when no dialog on aktivitet', async () => {
            const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Aktivitet uten dialog'));
            await act(() => fireEvent.click(getByText('Aktivitet uten dialog')));
            await waitFor(() => getByText('Endre på aktiviteten'));
            fireEvent.click(getByText('Send en melding'));
            expect(pushStateMock).toHaveBeenCalledWith(
                '',
                'Dialog',
                `/dialog/ny?aktivitetId=${aktivitetUtenDialog.id}`,
            );
        });
    });

    describe('Brukere:', () => {
        it('should not navigate when there is dialog on aktivitet', async () => {
            const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
            const { getByText } = render(<WrappedHovedside fnr={undefined} store={store} />);
            await waitFor(() => {
                getByText('Aktivitet med dialog');
            });
            await act(() => fireEvent.click(getByText('Aktivitet med dialog')));
            fireEvent.click(getByText('Send en melding'));
            expect(pushStateMock).not.toHaveBeenCalled();
        });

        it('should not navigate when no dialog on aktivitet', async () => {
            const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
            const { getByText } = render(<WrappedHovedside fnr={undefined} store={store} />);
            await waitFor(() => getByText('Aktivitet uten dialog'));
            await act(() => fireEvent.click(getByText('Aktivitet uten dialog')));
            await waitFor(() => getByText('Endre på aktiviteten'));
            fireEvent.click(getByText('Send en melding'));
            expect(pushStateMock).not.toHaveBeenCalled();
        });
    });
});
