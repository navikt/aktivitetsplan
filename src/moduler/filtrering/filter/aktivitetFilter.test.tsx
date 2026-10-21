import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

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
import { wrapAktivitet } from '../../../mocks/aktivitet';
import { enStillingFraNavAktivitet } from '../../../mocks/fixtures/stillingFraNavFixtures';
import { aktivitetTypeMap, AlleAktivitetTyper, stillingsEtikettMapper } from '../../../utils/textMappers';
import { WrappedHovedside } from '../../../testUtils/WrappedHovedside';
import { aktivVeilarbOppfolgingMockPeriode } from '../../../testUtils/store/defaultInitialStore';
import { gitt } from '../../../testUtils/store/mockStoreBuilder';

let id = 12012;
const exampleAktivitet = wrapAktivitet({
    ...enStillingFraNavAktivitet({ tittel: 'Servitør', arstall: 2017 }),
    arbeidsgiver: 'Arbeidsgiver',
    status: AktivitetStatus.GJENNOMFOERT,
});

const currentOppfolgingsperiode = aktivVeilarbOppfolgingMockPeriode;

function makeTestAktiviteter<T>(
    filterValues: T[],
    valueSetter: (aktivitet: AlleAktiviteter, value: T) => AlleAktiviteter,
) {
    const testAktiviteter = filterValues.map((filterValue) => {
        id += 1;
        return {
            ...valueSetter(exampleAktivitet, filterValue),
            id,
            tittel: `Aktivitet: ${filterValue}`,
            oppfolgingsperiodeId: currentOppfolgingsperiode.id,
        };
    }) as unknown as VeilarbAktivitet[];
    return testAktiviteter;
}

describe('aktivitets-filter', () => {
    it('should filter avtalt med nav', async () => {
        const aktiviteter = makeTestAktiviteter([true, false], (aktivitet, value) => {
            return {
                ...aktivitet,
                avtalt: value,
            };
        });
        const store = gitt().aktiviteter.medAktiviteter(aktiviteter).createStore();
        const { getByLabelText, getByText, queryByText, getByRole } = render(<WrappedHovedside store={store} />);

        await waitFor(() =>
            expect(getByRole('button', { name: 'Filtrer' }).attributes.getNamedItem('disabled')).toBeNull(),
        );
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(getByLabelText('Ikke avtalt med Nav'));
        getByRole('checkbox', { name: 'Ikke avtalt med Nav', checked: true });

        getByText('Aktivitet: false');
        expect(queryByText('Aktivitet: true')).toBeFalsy();
        fireEvent.click(getByLabelText('Avtalt med Nav'));
        fireEvent.click(getByLabelText('Ikke avtalt med Nav'));
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
        const aktiviteter = makeTestAktiviteter<VeilarbAktivitetType>(aktivitetTyper, (aktivitet, value) => {
            return {
                ...aktivitet,
                type: value,
            } as AlleAktiviteter;
        });
        const store = gitt().aktiviteter.medAktiviteter(aktiviteter).createStore();
        const { getByText, queryByText, queryAllByText, getByRole } = render(<WrappedHovedside store={store} />);
        for await (const { tittel, type } of aktiviteter) {
            await waitFor(() => getByRole('button', { name: 'Filtrer' }));
            fireEvent.click(getByRole('button', { name: 'Filtrer' }));
            fireEvent.click(queryAllByText(aktivitetTypeMap[type as AlleAktivitetTyper])[0]);
            await waitFor(() => getByText(tittel));
            // Sjekk at ingen andre aktiviteter vises
            aktivitetTyper
                .filter((andreTyper) => andreTyper != type)
                .forEach((typeSomIkkeSkalFinnes) => {
                    expect(queryByText(`Aktivitet: ${typeSomIkkeSkalFinnes}`)).toBeNull();
                });
            // Turn filter off
            fireEvent.click(queryAllByText(aktivitetTypeMap[type as AlleAktivitetTyper])[0]);
            // Close filter
            fireEvent.click(getByText('Filtrer'));
        }
    });

    it('Should filter based on etiketter (stilling fra Nav)', async () => {
        const statuser: StillingFraNavSoknadsstatus[] = [
            StillingFraNavSoknadsstatus.AVSLAG,
            StillingFraNavSoknadsstatus.VENTER,
        ];
        const aktiviteter = makeTestAktiviteter(statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                stillingFraNavData: {
                    ...(aktivitet as unknown as StillingFraNavAktivitet).stillingFraNavData,
                    soknadsstatus: value,
                },
            };
        });
        const store = gitt().aktiviteter.medAktiviteter(aktiviteter).createStore();
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
        const statuser: StillingStatus[] = [StillingStatus.INNKALT_TIL_INTERVJU, StillingStatus.SOKNAD_SENDT];
        const aktiviteter = makeTestAktiviteter(statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                etikett: value,
                type: VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
            } as AlleAktiviteter;
        });
        const store = gitt().aktiviteter.medAktiviteter(aktiviteter).createStore();
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
