import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { AvsluttOppfolgingPage } from './AvsluttOppfolgingPage';

vi.mock('../../analytics/analytics', () => ({ logKlikkKnapp: vi.fn() }));

const endpoint = '*/veilarboppfolging/api/v3/oppfolging/avslutt-egen-oppfolging';
const mottaBegrunnelse = vi.fn();
const server = setupServer(
    http.post(endpoint, async ({ request }) => {
        mottaBegrunnelse(await request.json());
        return new HttpResponse(null, { status: 204 });
    }),
);
const suksessmelding = 'Avslutningen av arbeidsrettet oppfølging var vellykket.';
const feilmelding = 'Noe gikk galt, og oppfølgingen ble ikke avsluttet. Prøv igjen senere.';
const knappNavn = 'Avslutt arbeidsrettet oppfølging';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.clearAllMocks();
});

function renderSkjema() {
    render(
        <MemoryRouter>
            <AvsluttOppfolgingPage />
        </MemoryRouter>,
    );
    return userEvent.setup();
}

describe('avslutt egen oppfølging', () => {
    it('sender ikke forespørsel uten bekreftelse', async () => {
        const user = renderSkjema();
        await user.click(screen.getByRole('button', { name: knappNavn }));

        expect(await screen.findByText('Du må bekrefte før du kan avslutte oppfølgingen.')).toBeInTheDocument();
        expect(mottaBegrunnelse).not.toHaveBeenCalled();
    });

    it.each(['', 'Jeg trenger ikke lenger oppfølging.'])(
        'sender kun begrunnelse og viser kvittering ved 204 (begrunnelse=%s)',
        async (begrunnelse) => {
            const user = renderSkjema();
            await user.click(screen.getByRole('checkbox'));
            if (begrunnelse) await user.type(screen.getByRole('textbox'), begrunnelse);
            await user.click(screen.getByRole('button', { name: knappNavn }));

            expect(await screen.findByText(suksessmelding)).toBeInTheDocument();
            expect(mottaBegrunnelse).toHaveBeenCalledExactlyOnceWith({ begrunnelse });
            expect(screen.getByText(suksessmelding).closest('.aksel-alert')).toHaveFocus();
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
            expect(screen.queryByText('Før du avslutter oppfølgingen din')).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Tilbake' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Gå til Min side' })).toBeInTheDocument();
        },
    );

    it.each([400, 401, 403, 409, 500])('viser feil og beholder skjemaet ved HTTP %s', async (status) => {
        server.use(
            http.post(endpoint, () =>
                HttpResponse.json(
                    { status, detail: 'Oppfølging kan ikke avsluttes', begrunnelse: 'Backend-begrunnelse' },
                    { status },
                ),
            ),
        );
        const user = renderSkjema();
        await user.click(screen.getByRole('checkbox'));
        await user.type(screen.getByRole('textbox'), 'Min begrunnelse');
        await user.click(screen.getByRole('button', { name: knappNavn }));

        const melding = await screen.findByText(status === 409 ? 'Oppfølgingen kan ikke avsluttes nå.' : feilmelding);
        await waitFor(() => expect(melding.closest('.aksel-alert')).toHaveFocus());
        expect(screen.queryByText(suksessmelding)).not.toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('Min begrunnelse');
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('viser feil ved nettverksfeil og lar bruker prøve igjen', async () => {
        server.use(http.post(endpoint, () => HttpResponse.error()));
        const user = renderSkjema();
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: knappNavn }));

        expect(await screen.findByText(feilmelding)).toBeInTheDocument();
        expect(screen.queryByText(suksessmelding)).not.toBeInTheDocument();

        server.resetHandlers();
        await user.click(screen.getByRole('button', { name: knappNavn }));
        expect(await screen.findByText(suksessmelding)).toBeInTheDocument();
    });

    it('viser ikke kvittering før forespørselen er fullført', async () => {
        let fullfor!: () => void;
        const venter = new Promise<void>((resolve) => {
            fullfor = resolve;
        });
        server.use(
            http.post(endpoint, async () => {
                await venter;
                return new HttpResponse(null, { status: 204 });
            }),
        );
        const user = renderSkjema();
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: knappNavn }));

        expect(screen.queryByText(suksessmelding)).not.toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeDisabled();
        await act(async () => fullfor());
        expect(await screen.findByText(suksessmelding)).toBeInTheDocument();
    });
});
