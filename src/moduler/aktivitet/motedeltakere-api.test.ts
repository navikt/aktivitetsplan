import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MotedeltakerRolle, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { enMoteAktivitet } from '../../mocks/fixtures/moteAktivitetFixtures';
import rootReducer from '../../store/rootReducer';
import { hentAktivitet, hentAktiviteter, lagNyAktivitet, oppdaterAktivitet } from './aktivitet-actions';
import { selectAktivitet } from './aktivitet-slice';

const motedeltakere = [
    { navn: 'Test Veileder', roller: [MotedeltakerRolle.VEILEDER] },
    { navn: 'Test Deltaker', roller: [MotedeltakerRolle.ARBEIDSGIVER, MotedeltakerRolle.MENTOR_FADDER] },
];
const lagredeMotedeltakere = motedeltakere.map((deltaker, index) => ({
    ...deltaker,
    opprettet: '2026-11-04T12:00:00+01:00',
    deltakerId: `01234567-89ab-4cde-8f01-234567890ab${index}`,
}));
const lagretAktivitet = enMoteAktivitet({ motedeltakere: lagredeMotedeltakere });

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Motedeltakere gjennom API og state', () => {
    it('sender nye deltakere med enum-roller og lagrer metadata fra POST-responsen', async () => {
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(new Response(JSON.stringify(lagretAktivitet), { status: 201 }));
        const store = configureStore({ reducer: rootReducer });
        const aktivitet = enMoteAktivitet({ motedeltakere });

        await store
            .dispatch(lagNyAktivitet({ aktivitet, oppfolgingsPeriodeId: aktivitet.oppfolgingsperiodeId }))
            .unwrap();

        const [url, request] = fetchMock.mock.calls[0];
        expect(url).toContain(`/aktivitet/${aktivitet.oppfolgingsperiodeId}/ny`);
        expect(request?.method).toBe('post');
        const body = JSON.parse(String(request?.body));
        expect(body.motedeltakere).toEqual(motedeltakere);
        expect(body).not.toHaveProperty('deltakere');
        expect(selectAktivitet(store.getState(), aktivitet.id)).toEqual(lagretAktivitet);
    });

    it('sender oppdaterte deltakere og bruker PUT-responsen som ny state', async () => {
        const oppdatertAktivitet = enMoteAktivitet({
            motedeltakere: [
                { ...lagredeMotedeltakere[0], navn: 'Endret Veileder' },
                { navn: 'Ny Deltaker', roller: [MotedeltakerRolle.TOLK], opprettet: null, deltakerId: null },
            ],
        });
        const respons = enMoteAktivitet({
            motedeltakere: [
                oppdatertAktivitet.motedeltakere![0],
                {
                    ...oppdatertAktivitet.motedeltakere![1],
                    opprettet: '2026-11-04T13:00:00+01:00',
                    deltakerId: '01234567-89ab-4cde-8f01-234567890abc',
                },
            ],
        });
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(new Response(JSON.stringify(respons), { status: 200 }));
        const store = configureStore({ reducer: rootReducer });
        store.dispatch(
            lagNyAktivitet.fulfilled(lagretAktivitet, 'request-id', {
                aktivitet: lagretAktivitet,
                oppfolgingsPeriodeId: lagretAktivitet.oppfolgingsperiodeId,
            }),
        );

        await store.dispatch(oppdaterAktivitet(oppdatertAktivitet)).unwrap();

        const [url, request] = fetchMock.mock.calls[0];
        expect(url).toContain(`/aktivitet/${oppdatertAktivitet.id}`);
        expect(request?.method).toBe('put');
        expect(JSON.parse(String(request?.body)).motedeltakere).toEqual(oppdatertAktivitet.motedeltakere);
        expect(selectAktivitet(store.getState(), lagretAktivitet.id)).toEqual(respons);
    });

    it.each(['alle', 'en'] as const)('henter motedeltakere og metadata via GraphQL (%s aktivitet)', async (variant) => {
        const store = configureStore({ reducer: rootReducer });
        store.dispatch(
            lagNyAktivitet.fulfilled(enMoteAktivitet(), 'request-id', {
                aktivitet: enMoteAktivitet(),
                oppfolgingsPeriodeId: lagretAktivitet.oppfolgingsperiodeId,
            }),
        );
        const response =
            variant === 'alle'
                ? {
                      data: {
                          perioder: [
                              {
                                  id: lagretAktivitet.oppfolgingsperiodeId,
                                  start: '2026-01-01',
                                  slutt: null,
                                  aktiviteter: [lagretAktivitet],
                              },
                          ],
                      },
                  }
                : { data: { aktivitet: { ...lagretAktivitet, historikk: { endringer: [] } }, eier: { fnr: 'test' } } };
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(new Response(JSON.stringify(response), { status: 200 }));

        if (variant === 'alle') {
            await store.dispatch(hentAktiviteter()).unwrap();
        } else {
            await store.dispatch(hentAktivitet(lagretAktivitet.id)).unwrap();
        }

        const requestBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
        expect(requestBody.query.replace(/\s+/g, ' ')).toContain(
            'motedeltakere { navn, roller, opprettet, deltakerId, }',
        );
        const aktivitet = selectAktivitet(store.getState(), lagretAktivitet.id);
        expect(aktivitet?.type).toBe(VeilarbAktivitetType.MOTE_TYPE);
        if (aktivitet?.type !== VeilarbAktivitetType.MOTE_TYPE) throw new Error('Forventet en møteaktivitet');
        expect(aktivitet.motedeltakere).toEqual(lagredeMotedeltakere);
    });
});
