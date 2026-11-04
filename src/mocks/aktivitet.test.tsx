import { render, screen, within } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import React from 'react';
import { Provider } from 'react-redux';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { lagNyAktivitet, oppdaterAktivitet } from '../api/aktivitetAPI';
import { hentAktiviteterGraphql, hentAktivitetGraphql } from '../api/aktivitetsplanGraphql';
import { MotedeltakerRolle, VeilarbAktivitetType } from '../datatypes/internAktivitetTypes';
import MoteDetaljer from '../moduler/aktivitet/visning/detaljer/MoteDetaljer';
import { mockTestAktiviteter, wrapAktivitet } from './aktivitet';
import { enMoteAktivitet } from './fixtures/moteAktivitetFixtures';
import { handlers } from './handlers';
import rootReducer from '../store/rootReducer';
import { hentPersonNavn } from '../moduler/person/person-slice';
import { ErVeilederContext } from '../Provider';
import { LocalStorageElement } from './demo/localStorage';

const server = setupServer(...handlers);
const motedeltakere = [
    { navn: 'Test Veileder', roller: [MotedeltakerRolle.VEILEDER] },
    { navn: 'Test Arbeidsgiver', roller: [MotedeltakerRolle.ARBEIDSGIVER, MotedeltakerRolle.MENTOR_FADDER] },
];

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
let opprinneligFnr: string | null;
beforeEach(() => {
    opprinneligFnr = sessionStorage.getItem(LocalStorageElement.FNR);
    sessionStorage.setItem(LocalStorageElement.FNR, 'testperson');
});
afterEach(() => {
    server.resetHandlers();
    if (opprinneligFnr === null) sessionStorage.removeItem(LocalStorageElement.FNR);
    else sessionStorage.setItem(LocalStorageElement.FNR, opprinneligFnr);
});
afterAll(() => server.close());

describe('Møtedeltakere i mockdata', () => {
    it('bevarer deltakere og metadata når aktiviteter pakkes inn', () => {
        const deltakereMedMetadata = motedeltakere.map((deltaker, index) => ({
            ...deltaker,
            opprettet: '2026-11-04T12:00:00+01:00',
            deltakerId: `01234567-89ab-4cde-8f01-234567890ab${index}`,
        }));

        expect(wrapAktivitet(enMoteAktivitet({ motedeltakere: deltakereMedMetadata })).motedeltakere).toEqual(
            deltakereMedMetadata,
        );
        expect(wrapAktivitet(enMoteAktivitet({ motedeltakere: [] })).motedeltakere).toEqual([]);
    });

    it('bevarer deltakerne på det forhåndsdefinerte mockmøtet', () => {
        const aktivitet = mockTestAktiviteter.find((aktivitet) => aktivitet.id === '6871');
        expect(aktivitet?.type).toBe(VeilarbAktivitetType.MOTE_TYPE);
        if (aktivitet?.type !== VeilarbAktivitetType.MOTE_TYPE) throw new Error('Forventet en møteaktivitet');

        expect(aktivitet.motedeltakere).toHaveLength(3);
        expect(aktivitet.motedeltakere?.some((deltaker) => deltaker.roller.includes(MotedeltakerRolle.BRUKER))).toBe(
            false,
        );
    });

    it('returnerer deltakerne ved oppretting, redigering og henting, slik at de vises på kortet', async () => {
        const aktivitet = enMoteAktivitet({ motedeltakere });
        const opprettet = await lagNyAktivitet(aktivitet, aktivitet.oppfolgingsperiodeId);
        expect(opprettet).toHaveProperty('motedeltakere', motedeltakere);

        const endredeDeltakere = [motedeltakere[0], { navn: 'Test Tolk', roller: [MotedeltakerRolle.TOLK] }];
        if (opprettet.type !== VeilarbAktivitetType.MOTE_TYPE) throw new Error('Forventet en møteaktivitet');
        const oppdatert = await oppdaterAktivitet({ ...opprettet, motedeltakere: endredeDeltakere });
        expect(oppdatert).toHaveProperty('motedeltakere', endredeDeltakere);

        const alleAktiviteter = await hentAktiviteterGraphql();
        const fraListe = alleAktiviteter.data.perioder
            .flatMap((periode) => periode.aktiviteter)
            .find((aktivitet) => aktivitet.id === opprettet.id);
        expect(fraListe).toHaveProperty('motedeltakere', endredeDeltakere);

        const hentet = await hentAktivitetGraphql(opprettet.id);
        expect(hentet.data.aktivitet).toHaveProperty('motedeltakere', endredeDeltakere);
        const store = configureStore({ reducer: rootReducer });
        await store.dispatch(hentPersonNavn()).unwrap();
        render(
            <ErVeilederContext.Provider value={true}>
                <Provider store={store}>
                    <MoteDetaljer aktivitet={hentet.data.aktivitet} />
                </Provider>
            </ErVeilederContext.Provider>,
        );
        expect(
            within(screen.getByRole('list'))
                .getAllByRole('listitem')
                .map((rad) => rad.textContent),
        ).toEqual(['Bruce Batty Wayne', 'Test Veileder (Veileder)', 'Test Tolk (Tolk)']);
    });
});
