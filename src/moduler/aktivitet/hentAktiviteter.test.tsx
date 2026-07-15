import { wrapAktivitet } from '../../mocks/aktivitet';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { failOrGrahpqlResponse } from '../../mocks/utils';
import { aktivitestplanResponse, handlers } from '../../mocks/handlers';
import { describe } from 'vitest';
import { AktivitetStatus, AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { mockOppfolging } from '../../mocks/data/oppfolging';
import { erHistorisk } from '../../datatypes/oppfolgingTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { enStillingFraNavAktivitet } from '../../mocks/fixtures/stillingFraNavFixtures';
import { act, render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import React from 'react';
import { aktivitetTypeMap } from '../../utils/textMappers';
import { gitt } from '../../testUtils/store/mockStoreBuilder';

let id = 12012;
const exampleAktivitet = wrapAktivitet({
    ...enStillingFraNavAktivitet({ tittel: 'Servitør', arstall: 2017 }),
    arbeidsgiver: 'Arbeidsgiver',
    status: AktivitetStatus.GJENNOMFOERT,
});

function setAktiviteterReturnedFromGraphql<T>(
    filterValues: T[],
    valueSetter: (aktivitet: AlleAktiviteter, value: T) => AlleAktiviteter,
) {
    const currentOppfolgingsperiode = mockOppfolging.oppfolgingsPerioder.filter((periode) => !erHistorisk(periode))[0]
        .id;
    const testAktiviteter = filterValues.map((filterValue) => {
        id += 1;
        return {
            ...valueSetter(exampleAktivitet, filterValue),
            id,
            tittel: `Aktivitet: ${filterValue}`,
            oppfolgingsperiodeId: currentOppfolgingsperiode,
        };
    }) as unknown as VeilarbAktivitet[];
    filterTestData = testAktiviteter;
    return testAktiviteter.map(({ tittel, type }) => ({ tittel, type }));
}

let filterTestData = [] as VeilarbAktivitet[];
const server = setupServer(
    http.post(
        '/veilarbaktivitet/graphql',
        failOrGrahpqlResponse(
            () => false,
            () => {
                return aktivitestplanResponse({ aktiviteter: filterTestData });
            },
        ),
    ),
    ...handlers,
);

describe('hent aktiviteter via graphql', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    it('skal vise aktiviteter hentet via graphql endepunkt i aktivitetstavle', async () => {
        const aktivitetTyper = [
            VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE,
            VeilarbAktivitetType.MOTE_TYPE,
            VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
        ];
        // const store = configureStore({ reducer, preloadedState: emptyHalfLoadedVeilederState as any });
        const store = gitt().aktiviteter.aktiviteterNotLoaded().createStore();
        const aktiviteter = setAktiviteterReturnedFromGraphql<VeilarbAktivitetType>(
            aktivitetTyper,
            (aktivitet, value) => {
                return {
                    ...aktivitet,
                    type: value,
                } as AlleAktiviteter;
            },
        ) as {
            tittel: string;
            type:
                | VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE
                | VeilarbAktivitetType.MOTE_TYPE
                | VeilarbAktivitetType.STILLING_AKTIVITET_TYPE;
        }[];
        const { getByText } = await act(() => render(<WrappedHovedside store={store} />));
        for await (const { tittel, type } of aktiviteter) {
            getByText(aktivitetTypeMap[type]);
            await waitFor(() => getByText(tittel));
        }
    });
});
