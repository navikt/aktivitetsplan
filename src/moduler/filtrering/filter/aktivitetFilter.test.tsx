import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import React from 'react';
import { Store } from 'redux';

import {
    AktivitetStatus,
    AlleAktiviteter,
    StillingFraNavSoknadsstatus,
    StillingStatus,
} from '../../../datatypes/aktivitetTypes';
import {
    StillingFraNavAktivitet,
    VeilarbAktivitet,
    VeilarbAktivitetType,
} from '../../../datatypes/internAktivitetTypes';
import { aktiviteterData, wrapAktivitet } from '../../../mocks/aktivitet';
import { mockOppfolging } from '../../../mocks/data/oppfolging';
import { enStillingFraNavAktivitet } from '../../../mocks/fixtures/stillingFraNavFixtures';
import { aktivitestplanResponse, handlers } from '../../../mocks/handlers';
import reducer from '../../../reducer';
import { aktivitetTypeMap, stillingsEtikettMapper } from '../../../utils/textMappers';
import { erHistorisk } from '../../../datatypes/oppfolgingTypes';
import { WrappedHovedside } from '../../../testUtils/WrappedHovedside';
import { emptyLoadedVeilederState } from '../../../testUtils/defaultInitialStore';
import { rest } from 'msw';
import { failOrGrahpqlResponse } from '../../../mocks/utils';
import { expect } from 'vitest';

let id = 12012;
const exampleAktivitet = wrapAktivitet({
    ...enStillingFraNavAktivitet({ tittel: 'Servitør', arstall: 2017 }),
    arbeidsgiver: 'Arbeidsgiver',
    status: AktivitetStatus.GJENNOMFOERT,
});

function makeTestAktiviteter<T>(
    store: Store,
    filterValues: T[],
    valueSetter: (aktivitet: AlleAktiviteter, value: T) => AlleAktiviteter,
) {
    const currentOppfolgingsperiode = mockOppfolging.oppfolgingsPerioder.filter((periode) => !erHistorisk(periode))[0]
        .uuid;
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

let filterTestData = aktiviteterData.aktiviteter;
const server = setupServer(
    rest.post(
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

describe('aktivitets-filter', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    it('verifiser deploy-alarm', async () => {
        expect(2).toBe(4);
    });

    it('should filter avtalt med nav', async () => {
        const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
        makeTestAktiviteter(store, [true, false], (aktivitet, value) => {
            return {
                ...aktivitet,
                avtalt: value,
            };
        });
        const { getByLabelText, getByText, queryByText, getByRole } = render(<WrappedHovedside store={store} />);

        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull(),
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(getByLabelText('Ikke avtalt med NAV'));
        getByRole('checkbox', { name: 'Ikke avtalt med NAV', checked: true });

        getByText('Aktivitet: false');
        expect(queryByText('Aktivitet: true')).toBeFalsy();
        fireEvent.click(getByLabelText('Avtalt med NAV'));
        fireEvent.click(getByLabelText('Ikke avtalt med NAV'));
        getByText('Aktivitet: true');
        expect(queryByText('Aktivitet: false')).toBeFalsy();
        expect(queryByText('Assisterende skipskokk')).toBeNull();
    });

    it('should filter on aktivitet type', async () => {
        const aktivitetTyper = [
            VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE,
            VeilarbAktivitetType.MOTE_TYPE,
            VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
        ];
        const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
        const aktiviteter = makeTestAktiviteter<VeilarbAktivitetType>(store, aktivitetTyper, (aktivitet, value) => {
            return {
                ...aktivitet,
                type: value,
            } as AlleAktiviteter;
        }) as {
            tittel: string;
            type:
                | VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE
                | VeilarbAktivitetType.MOTE_TYPE
                | VeilarbAktivitetType.STILLING_AKTIVITET_TYPE;
        }[];
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        for await (const { tittel, type } of aktiviteter) {
            await waitFor(() => getByRole('button', { name: 'Filtrer' }));
            fireEvent.click(getByRole('button', { name: 'Filtrer' }));
            fireEvent.click(queryAllByText(aktivitetTypeMap[type])[0]);
            await waitFor(() => getByText(tittel));
            // Sjekk at ingen andre aktiviteter vises
            aktivitetTyper
                .filter((andreTyper) => andreTyper != type)
                .forEach((typeSomIkkeSkalFinnes) => {
                    expect(queryByText(`Aktivitet: ${typeSomIkkeSkalFinnes}`)).toBeNull();
                });
            // Turn filter off
            fireEvent.click(queryAllByText(aktivitetTypeMap[type])[0]);
            // Close filter
            fireEvent.click(getByText('Filtrer'));
        }
    });

    it('Should filter based on etiketter (stilling fra NAV)', async () => {
        const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
        const statuser: StillingFraNavSoknadsstatus[] = [
            StillingFraNavSoknadsstatus.AVSLAG,
            StillingFraNavSoknadsstatus.VENTER,
        ];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                stillingFraNavData: {
                    ...(aktivitet as unknown as StillingFraNavAktivitet).stillingFraNavData,
                    soknadsstatus: value,
                },
            };
        });
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        await waitFor(() => getByText(`Aktivitet: VENTER`));
        getByText(`Aktivitet: AVSLAG`);
        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull(),
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(queryAllByText(stillingsEtikettMapper['AVSLAG'])[0]);
        expect(getByText(`Aktivitet: AVSLAG`)).not.toBeNull();
        expect(queryByText(`Aktivitet: SOKNAD_SENDT`)).toBeNull();
        fireEvent.click(getByText('Filtrer'));
    });

    it('Should filter based on etiketter (stilling)', async () => {
        const store = configureStore({ reducer, preloadedState: emptyLoadedVeilederState as any });
        const statuser: StillingStatus[] = [StillingStatus.INNKALT_TIL_INTERVJU, StillingStatus.SOKNAD_SENDT];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                etikett: value,
                type: VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
            } as AlleAktiviteter;
        });
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        await waitFor(() => getByText(`Aktivitet: INNKALT_TIL_INTERVJU`));
        getByText(`Aktivitet: SOKNAD_SENDT`);
        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull(),
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(queryAllByText(stillingsEtikettMapper['INNKALT_TIL_INTERVJU'])[0]);
        expect(getByText(`Aktivitet: INNKALT_TIL_INTERVJU`)).not.toBeNull();
        expect(queryByText(`Aktivitet: SOKNAD_SENDT`)).toBeNull();
    });
});
