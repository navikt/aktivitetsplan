import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';

import { ErVeilederContext } from '../../../../Provider';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { enSamtalereferatAktivitet } from '../../../../mocks/fixtures/samtalereferatFixtures';
import { gitt } from '../../../../testUtils/store/mockStoreBuilder';
import ReferatContainer from './ReferatContainer';
import { enMoteAktivitet } from '../../../../mocks/fixtures/moteAktivitetFixtures';
import { createLocalStorageKey } from '../../aktivitet-forms/samtalereferat/useSamtalereferatKladd';

const renderReferatContainer = (aktivitet: SamtalereferatAktivitet | MoteAktivitet, erVeileder = true) => {
    const store = gitt().createStore();
    return render(
        <ErVeilederContext value={erVeileder}>
            <Provider store={store}>
                <ReferatContainer aktivitet={aktivitet} />
            </Provider>
        </ErVeilederContext>,
    );
};

describe('ReferatContainer', () => {
    describe('møter og referatboks', () => {
        it('skal ikke vise referatboks for møter frem i tid', () => {
            const aktivitet = enMoteAktivitet({
                status: AktivitetStatus.GJENNOMFOERT,
                fraDato: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day in the future,
                tilDato: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // 1 hour after start
                erReferatPublisert: false,
                referat: '',
            });
            const { queryByText } = renderReferatContainer(aktivitet);
            expect(queryByText('Samtalereferat')).not.toBeInTheDocument();
        });

        it('skal vise referatboks for møter frem i tid som er fullført', () => {
            const aktivitet = enMoteAktivitet({
                status: AktivitetStatus.FULLFOERT,
                fraDato: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day in the future,
                tilDato: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // 1 hour after start
                erReferatPublisert: false,
            });
            const { queryByText } = renderReferatContainer(aktivitet);
            expect(queryByText('Samtalereferat')).toBeInTheDocument();
        });

        it.skip('skal vise referatboks for møter frem i tid hvis referatet er laget likevel', () => {
            const aktivitet = enMoteAktivitet({
                status: AktivitetStatus.GJENNOMFOERT,
                fraDato: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day in the future,
                tilDato: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // 1 hour after start
                referat: 'det finnes et referat her',
                erReferatPublisert: false,
            });
            const { queryByText } = renderReferatContainer(aktivitet);
            expect(queryByText('Samtalereferat')).toBeInTheDocument();
        });
    });

    describe('når aktiviteten er fullført', () => {
        it('skal vise "Del med bruker"-knapp når referatet ikke er delt', async () => {
            const aktivitet = enSamtalereferatAktivitet({
                status: AktivitetStatus.FULLFOERT,
                erReferatPublisert: false,
            });
            const { findByText, queryByText } = renderReferatContainer(aktivitet);
            await findByText('Del med bruker');
            expect(queryByText('Endre referat')).toBeNull();
        });

        it('skal ikke vise "Endre referat"-knapp når referatet ikke er delt', async () => {
            const aktivitet = enSamtalereferatAktivitet({
                status: AktivitetStatus.FULLFOERT,
                erReferatPublisert: false,
            });
            const { queryByText, findByText } = renderReferatContainer(aktivitet);
            await findByText('Del med bruker');
            expect(queryByText('Endre referat')).toBeNull();
        });

        it('skal ikke vise noen knapper når referatet er delt', async () => {
            const aktivitet = enSamtalereferatAktivitet({
                status: AktivitetStatus.FULLFOERT,
                erReferatPublisert: true,
            });
            const { queryByText, findByText } = renderReferatContainer(aktivitet);
            await findByText('Samtalereferat');
            expect(queryByText('Del med bruker')).toBeNull();
            expect(queryByText('Endre referat')).toBeNull();
        });
    });

    describe('når aktiviteten er avbrutt', () => {
        it('skal vise "Del med bruker"-knapp når referatet ikke er delt', async () => {
            const aktivitet = enSamtalereferatAktivitet({ status: AktivitetStatus.AVBRUTT, erReferatPublisert: false });
            const { findByText, queryByText } = renderReferatContainer(aktivitet);
            await findByText('Del med bruker');
            expect(queryByText('Endre referat')).toBeNull();
        });

        it('skal ikke vise "Endre referat"-knapp når referatet ikke er delt', async () => {
            const aktivitet = enSamtalereferatAktivitet({ status: AktivitetStatus.AVBRUTT, erReferatPublisert: false });
            const { queryByText, findByText } = renderReferatContainer(aktivitet);
            await findByText('Del med bruker');
            expect(queryByText('Endre referat')).toBeNull();
        });

        it('skal ikke vise noen knapper når referatet er delt', async () => {
            const aktivitet = enSamtalereferatAktivitet({ status: AktivitetStatus.AVBRUTT, erReferatPublisert: true });
            const { queryByText, findByText } = renderReferatContainer(aktivitet);
            await findByText('Samtalereferat');
            expect(queryByText('Del med bruker')).toBeNull();
            expect(queryByText('Endre referat')).toBeNull();
        });
    });

    describe('Oppdater referat - isDirty', () => {
        it('"Del endring" knapp skal være disabled hvis referate ikke er endret', async () => {
            const aktivitet = enSamtalereferatAktivitet({
                status: AktivitetStatus.GJENNOMFOERT,
                erReferatPublisert: true,
            });
            const { findByText } = renderReferatContainer(aktivitet);
            const endreReferatKnapp = await findByText('Endre referat');
            fireEvent.click(endreReferatKnapp);
            const deleKnapp = await findByText('Del endring');
            expect(deleKnapp.parentElement).toBeDisabled();
        });

        it('"Del endring" knapp skal IKKE være disabled hvis referate er endret', async () => {
            const aktivitet = enSamtalereferatAktivitet({
                status: AktivitetStatus.GJENNOMFOERT,
                erReferatPublisert: true,
            });
            const { findByText, findByLabelText } = renderReferatContainer(aktivitet);
            const endreReferatKnapp = await findByText('Endre referat');
            fireEvent.click(endreReferatKnapp);
            const samtaleReferatTextArea = await findByLabelText('Samtalereferat');
            fireEvent.change(samtaleReferatTextArea, { target: { value: 'Ny tekst' } });
            const deleKnapp = await findByText('Del endring');
            expect(deleKnapp.parentElement).not.toBeDisabled();
        });

        it('"Del endring" knapp skal ikke være disabled hvis referatet ikke er endret men man ser på en kladd', async () => {
            const aktivitet = enSamtalereferatAktivitet({
                status: AktivitetStatus.GJENNOMFOERT,
                erReferatPublisert: true,
            });
            const kladdInnslag = { samtalereferat: 'en kladd', tidspunkt: Date.now() };
            localStorage.setItem(createLocalStorageKey({ aktivitetId: aktivitet.id }), JSON.stringify(kladdInnslag));
            const { findByText } = renderReferatContainer(aktivitet);
            const endreReferatKnapp = await findByText('Endre referat');
            fireEvent.click(endreReferatKnapp);
            const deleKnapp = await findByText('Del endring');
            expect(deleKnapp.parentElement).not.toBeDisabled();
        });
    });
});
