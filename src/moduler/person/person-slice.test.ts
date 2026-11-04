import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { LocalStorageElement } from '../../mocks/demo/localStorage';
import { initialPageLoadThunks } from '../../routing/initialPageLoadThunk';
import { Status } from '../../store/createGenericSlice';
import rootReducer from '../../store/rootReducer';
import { selectHovedsideFeil } from '../feilmelding/feil-selector';
import { selectPersonNavn, selectPersonStatus } from './person-selector';
import { hentPersonNavn } from './person-slice';

const server = setupServer();
let opprinneligFnr: string | null;

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
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

describe('Brukerens navn', () => {
    it('henter navn ved oppstart og mellomlagrer kun navnet, ikke resten av personopplysningene', async () => {
        sessionStorage.setItem(LocalStorageElement.FNR, 'testperson');
        const kall = vi.fn();
        server.use(
            http.post('/veilarbperson/api/v3/person/hent-navn', async ({ request }) => {
                kall(await request.json());
                return HttpResponse.json({
                    fornavn: 'Test',
                    mellomnavn: 'Mellomnavn',
                    etternavn: 'Bruker',
                    barn: [],
                    fodselsdato: '2000-01-01',
                });
            }),
        );
        const store = configureStore({ reducer: rootReducer });

        await store.dispatch(initialPageLoadThunks.person(true));
        await store.dispatch(initialPageLoadThunks.person(true));

        expect(kall).toHaveBeenCalledExactlyOnceWith({ fnr: 'testperson' });
        expect(selectPersonStatus(store.getState())).toBe(Status.OK);
        expect(store.getState().data.person.data).toEqual({ navn: 'Test Mellomnavn Bruker' });
    });

    it('kaller ikke veilarbperson i brukerflaten', async () => {
        sessionStorage.removeItem(LocalStorageElement.FNR);
        const kall = vi.fn();
        server.use(
            http.post('/veilarbperson/api/v3/person/hent-navn', async ({ request }) => {
                kall(await request.text());
                return HttpResponse.json({ fornavn: 'Test', etternavn: 'Bruker' });
            }),
        );
        const store = configureStore({ reducer: rootReducer });

        await store.dispatch(initialPageLoadThunks.person(false));

        expect(kall).not.toHaveBeenCalled();
        expect(selectPersonNavn(store.getState())).toBeUndefined();
        expect(selectPersonStatus(store.getState())).toBe(Status.NOT_STARTED);
    });

    it('gjør feil fra personoppslaget synlig i appens feilhåndtering', async () => {
        server.use(http.post('/veilarbperson/api/v3/person/hent-navn', () => new HttpResponse(null, { status: 500 })));
        const store = configureStore({ reducer: rootReducer });

        await store.dispatch(hentPersonNavn());

        expect(selectPersonStatus(store.getState())).toBe(Status.ERROR);
        expect(selectPersonNavn(store.getState())).toBeUndefined();
        expect(selectHovedsideFeil(store.getState())).toEqual([
            expect.objectContaining({ type: hentPersonNavn.rejected.type, code: '500' }),
        ]);
    });

    it('avviser et svar uten navn i stedet for å lagre et tomt navn', async () => {
        server.use(http.post('/veilarbperson/api/v3/person/hent-navn', () => HttpResponse.json({})));
        const store = configureStore({ reducer: rootReducer });

        await store.dispatch(hentPersonNavn());

        expect(selectPersonStatus(store.getState())).toBe(Status.ERROR);
        expect(selectHovedsideFeil(store.getState())).toEqual([
            expect.objectContaining({ message: 'Mangler navn i svaret fra veilarbperson' }),
        ]);
    });

    it('melder fra hvis navneoppslaget mangler brukerident', async () => {
        sessionStorage.removeItem(LocalStorageElement.FNR);
        const store = configureStore({ reducer: rootReducer });

        await store.dispatch(hentPersonNavn());

        expect(selectPersonStatus(store.getState())).toBe(Status.ERROR);
        expect(selectHovedsideFeil(store.getState())).toEqual([
            expect.objectContaining({ message: 'Mangler brukerident for navneoppslag' }),
        ]);
    });
});
