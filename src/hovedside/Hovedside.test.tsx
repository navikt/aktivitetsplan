import React from 'react';
import { describe } from 'vitest';
import { WrappedHovedside } from '../testUtils/WrappedHovedside';
import { act, render } from '@testing-library/react';
import { emptyLoadedVeilederState } from '../testUtils/defaultInitialStore';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { failOrGrahpqlResponse } from '../mocks/utils';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../reducer';
import { handlers } from '../mocks/handlers';
import { getErrorText } from '../moduler/feilmelding/Feilmelding';
import { hentArenaAktiviteter } from '../moduler/aktivitet/arena-aktiviteter-slice';
import { Status } from '../createGenericSlice';

const initialState = {
    data: {
        ...emptyLoadedVeilederState.data,
        aktiviteter: {
            status: Status.NOT_STARTED,
            data: [],
        },
        arenaAktiviteter: {
            status: Status.NOT_STARTED,
            data: [],
        },
    },
};

// Fail on graphql endpoint
const server = setupServer(
    ...[
        // If handlers on same route are declared twice the first one is used
        http.post(
            '/veilarbaktivitet/graphql',
            failOrGrahpqlResponse(
                () => true,
                () => {
                    return {};
                },
            ),
        ),
        ...handlers,
    ],
);

vi.mock('../felles-komponenter/utils/logging', async () => {
    const actual: object = await vi.importActual('../felles-komponenter/utils/logging');
    return {
        ...actual,
        default: vi.fn(),
        loggTidBruktGaaInnPaaAktivitetsplanen: vi.fn(),
        logTimeToAktivitestavlePaint: vi.fn(),
        loggingAntallBrukere: vi.fn(),
    };
});

describe('Hovedside.tsx', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    it('should show error if graphql endpoint fails with 200 statuscode and errors in payload', async () => {
        const store = configureStore({ reducer: reducer, preloadedState: initialState });
        const { getByText } = await act(() => {
            return render(<WrappedHovedside store={store} />);
        });
        const feilmeldingTekst = getErrorText([{ type: hentArenaAktiviteter.rejected.type }]);
        getByText(feilmeldingTekst);
    });
});
