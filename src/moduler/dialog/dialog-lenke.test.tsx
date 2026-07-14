import { setupServer } from 'msw/node';
import { describe, expect } from 'vitest';
import { act, fireEvent, render, waitFor, screen } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { mockfnr } from '../../mocks/utils';
import { enEgenAktivitet } from '../../mocks/fixtures/egenAktivitet';
import { aktivPeriodeId, defaultMockOppfolgingsPerioder } from '../../mocks/data/oppfolging';
import { erHistorisk } from '../../datatypes/oppfolgingTypes';
import dialoger from '../../mocks/data/dialog';
import { aktiviteterData } from '../../mocks/aktivitet';
import { handlersWithGraphqlOverride } from '../../testUtils/restMockUtils';
import { mockLoadedStore } from '../../testUtils/storeMockUtils';
import { gitt } from '../../testUtils/store/mockStoreBuilder';

const aktivitetIdErSomErMocket = aktiviteterData.aktiviteter.map((it) => it.id);
const currentOppfolgingsperiode = defaultMockOppfolgingsPerioder.filter((periode) => !erHistorisk(periode))[0].id;
const aktivitetMedDialog = enEgenAktivitet({
    id: aktivitetIdErSomErMocket[0],
    tittel: 'Aktivitet med dialog',
    oppfolgingsperiodeId: aktivPeriodeId,
});
const aktivitetUtenDialog = enEgenAktivitet({
    id: aktivitetIdErSomErMocket[1],
    tittel: 'Aktivitet uten dialog',
    oppfolgingsperiodeId: aktivPeriodeId,
});
const testAktiviteter = [aktivitetMedDialog, aktivitetUtenDialog];
const testDialoger = [{ ...dialoger[0], aktivitetId: aktivitetIdErSomErMocket[0] }];

/* Kan ikke mocke alt fordi dialoger hentes on-mount
selvom de ligger i store slik at aktiviteter holdes oppdatert
 når man skriver melding koblet til dem*/
const server = setupServer(
    ...handlersWithGraphqlOverride({
        aktiviteter: testAktiviteter,
        dialoger: testDialoger,
    }),
);

const store = gitt().aktiviteter.medAktiviteter(testAktiviteter).createStore();

describe('Send melding knapp (Dialog lenker)', () => {
    // Start server before all tests
    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' });
    });
    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => {
        server.resetHandlers();
    });

    describe('Veiledere:', () => {
        it('should use /:dialogId when there is dialog on aktivitet', async () => {
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);

            await waitFor(() => {
                getByText(aktivitetMedDialog.tittel);
            });
            await act(() => fireEvent.click(getByText(aktivitetMedDialog.tittel)));

            const sendMeldingButton = getByText('Send en melding').parentElement;
            expect(sendMeldingButton).toHaveAttribute('href', `/dialog/${testDialoger[0].id}`);
        });

        it('should use /ny when no dialog on aktivitet', async () => {
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);

            await waitFor(() => getByText(aktivitetUtenDialog.tittel));
            await act(() => fireEvent.click(getByText(aktivitetUtenDialog.tittel)));
            await waitFor(() => getByText('Endre på aktiviteten'));

            const sendMeldingButton = getByText('Send en melding').parentElement;
            expect(sendMeldingButton).toHaveAttribute('href', `/dialog/ny?aktivitetId=${aktivitetUtenDialog.id}`);
        });
    });

    describe('Brukere:', () => {
        it('should not navigate when there is dialog on aktivitet', async () => {
            const { getByText } = render(<WrappedHovedside fnr={undefined} store={store} />);

            await waitFor(() => {
                getByText('Aktivitet med dialog');
            });
            await act(() => fireEvent.click(getByText('Aktivitet med dialog')));

            const sendMeldingButton = getByText('Send en melding').parentElement;
            expect(sendMeldingButton).toHaveAttribute(
                'href',
                `https://pto.dev.nav.no/arbeid/dialog/${testDialoger[0].id}`,
            );
        });

        it('should not navigate when no dialog on aktivitet', async () => {
            const { getByText } = render(<WrappedHovedside fnr={undefined} store={store} />);
            await waitFor(() => getByText(aktivitetUtenDialog.tittel));
            await act(() => fireEvent.click(getByText(aktivitetUtenDialog.tittel)));
            await waitFor(() => getByText('Endre på aktiviteten'));

            const sendMeldingButton = getByText('Send en melding').parentElement;
            expect(sendMeldingButton).toHaveAttribute(
                'href',
                `https://pto.dev.nav.no/arbeid/dialog/ny?aktivitetId=${aktivitetUtenDialog.id}`,
            );
        });
    });
});
