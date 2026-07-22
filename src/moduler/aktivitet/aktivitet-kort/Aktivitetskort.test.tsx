/**
 * Tests for Aktivitetskort — written against the rendered output of the full component.
 * These tests cover the business logic currently embedded in AktivitetskortPeriodeVisning
 * and AktivitetskortTillegg, but do NOT depend on the internal component structure.
 * Refactoring those child components freely should not break these tests.
 */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { subDays } from 'date-fns';

import { ErVeilederContext } from '../../../Provider';
import { GRUPPE_AKTIVITET_TYPE, MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { StillingFraNavSoknadsstatus } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../../datatypes/transaksjonstyperTypes';
import { AktivitetsId, OppfolgingsPeriodeId } from '../../../datatypes/brandedTypes';
import { Status } from '../../../store/createGenericSlice';
import rootReducer, { RootState } from '../../../store/rootReducer';
import { enEgenAktivitet } from '../../../mocks/fixtures/egenAktivitet';
import { enMoteAktivitet } from '../../../mocks/fixtures/moteAktivitetFixtures';
import { enStillingFraNavAktivitet, enStillingFraNavData } from '../../../mocks/fixtures/stillingFraNavFixtures';
import { enStillingAktivitet } from '../../../mocks/fixtures/stillingFixtures';
import { Dialog } from '../../../datatypes/dialogTypes';
import { gitt } from '../../../testUtils/store/mockStoreBuilder';
import { aktivVeilarbOppfolgingMockPeriode } from '../../../testUtils/store/defaultInitialStore';

import Aktivitetskort from './Aktivitetskort';
import { enSokeAktivitet } from '../../../mocks/sokeAktivitetFixtures';

const PERIODE_ID = aktivVeilarbOppfolgingMockPeriode.id as OppfolgingsPeriodeId;
const AKTIVITET_ID = 'test-aktivitet-42' as AktivitetsId;

const baseEgenAktivitet = enEgenAktivitet({ id: AKTIVITET_ID, tittel: 'Test', oppfolgingsperiodeId: PERIODE_ID });
const stillingAktivitet = enStillingAktivitet({
    tittel: 'Stilling',
});
const sokeAvtaleAktivitet = enSokeAktivitet({ tittel: 'Sokeavtalte tittel' });

// --- Render helper ---

const renderKort = (aktivitet: any, overrides: { store?: any; erVeileder?: boolean } = {}) => {
    const store = overrides.store ?? gitt().createStore();
    return render(
        <ErVeilederContext value={overrides.erVeileder ?? false}>
            <Provider store={store}>
                <MemoryRouter>
                    <Aktivitetskort aktivitet={aktivitet} className="" />
                </MemoryRouter>
            </Provider>
        </ErVeilederContext>,
    );
};

const lagStoreWithDialog = (dialogs: Dialog[]) => {
    const base = gitt().createStore().getState() as RootState;
    return configureStore({
        reducer: rootReducer,
        preloadedState: {
            ...base,
            data: {
                ...base.data,
                dialog: {
                    status: Status.OK,
                    sistOppdatert: '',
                    data: dialogs,
                },
            },
        },
    });
};

const lagStoreWithLest = (lestTidspunkt: string, identitetId = 'Z123456') => {
    const base = gitt().createStore().getState() as RootState;
    return configureStore({
        reducer: rootReducer,
        preloadedState: {
            ...base,
            data: {
                ...base.data,
                lest: {
                    status: Status.OK,
                    data: [{ tidspunkt: lestTidspunkt, ressurs: 'aktivitetsplan' }],
                },
                identitet: {
                    status: Status.OK,
                    data: { id: identitetId, erVeileder: false, erBruker: true },
                },
            },
        },
    });
};

// ============================================================
// Periode display — tests the "when/date" logic
// ============================================================

describe('Aktivitetskort — periodevisning', () => {
    it('should show only fraDato for MOTE (not a range)', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: MOTE_TYPE as VeilarbAktivitetType.MOTE_TYPE,
            fraDato: '2024-03-15T10:00:00.000',
            tilDato: '2024-03-15T12:00:00.000',
            kanal: 'OPPMOTE',
            adresse: '',
            beskrivelse: '',
            forberedelser: '',
            referat: '',
            erReferatPublisert: true,
            klokkeslett: '10:00',
            varighet: '2t',
        };
        renderKort(aktivitet);
        expect(await screen.findByText('15. mars 2024')).toBeInTheDocument();
        expect(screen.queryByText(/15. mars 2024 - /)).toBeNull();
    });

    it('should show only fraDato for SAMTALEREFERAT', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: SAMTALEREFERAT_TYPE as VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
            fraDato: '2024-05-20T09:00:00.000',
            tilDato: '2024-06-20T09:00:00.000',
            kanal: 'OPPMOTE',
            referat: '',
            erReferatPublisert: true,
        };
        renderKort(aktivitet);
        expect(await screen.findByText('20. mai 2024')).toBeInTheDocument();
        expect(screen.queryByText(/mai 2024 - /)).toBeNull();
    });

    it('should show single date for GRUPPEAKTIVITET when fraDato equals tilDato', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: GRUPPE_AKTIVITET_TYPE,
            fraDato: '2024-07-10T00:00:00.000',
            tilDato: '2024-07-10T00:00:00.000',
        };
        renderKort(aktivitet);
        expect(await screen.findByText('10. juli 2024')).toBeInTheDocument();
        expect(screen.queryByText(/10. juli 2024 - /)).toBeNull();
    });

    it('should show date range for GRUPPEAKTIVITET when fraDato differs from tilDato', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: GRUPPE_AKTIVITET_TYPE,
            fraDato: '2024-07-10T00:00:00.000',
            tilDato: '2024-08-20T00:00:00.000',
        };
        renderKort(aktivitet);
        expect(await screen.findByText('10. juli 2024 - 20. aug. 2024')).toBeInTheDocument();
    });

    it('should show "Til: date" when only tilDato is present', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE,
            fraDato: undefined,
            tilDato: '2024-09-01T00:00:00.000',
        };
        renderKort(aktivitet);
        expect(await screen.findByText('Til: 1. sep. 2024')).toBeInTheDocument();
    });

    it('should show "Fra: date" when only fraDato is present', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE,
            fraDato: '2024-04-01T00:00:00.000',
            tilDato: undefined,
        };
        renderKort(aktivitet);
        expect(await screen.findByText('Fra: 1. apr. 2024')).toBeInTheDocument();
    });

    it('should show full date range when both dates are present', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE,
            fraDato: '2024-01-01T00:00:00.000',
            tilDato: '2024-12-31T00:00:00.000',
        };
        renderKort(aktivitet);
        expect(await screen.findByText('1. jan. 2024 - 31. des. 2024')).toBeInTheDocument();
    });

    it('should NOT show a period for STILLING_FRA_NAV (renders nothing for period)', async () => {
        const aktivitet = enStillingFraNavAktivitet({ tittel: 'NAV stilling' });
        renderKort(aktivitet);
        // STILLING_FRA_NAV has soknadsstatus, so the card renders — just no date period
        expect(await screen.findByText('Venter på å bli kontaktet')).toBeInTheDocument();
        expect(screen.queryByText(/jan\./)).toBeNull();
    });
});

// ============================================================
// Tillegg / etiketter — tests the conditional badge/tag logic
// ============================================================

describe('Aktivitetskort — tillegg og etiketter', () => {
    it('should show "Avtalt med Nav" tag when aktivitet is avtalt', async () => {
        renderKort({ ...baseEgenAktivitet, avtalt: true });
        expect(await screen.findByText('Avtalt med Nav')).toBeInTheDocument();
    });

    it('should NOT show "Avtalt med Nav" when aktivitet is not avtalt', () => {
        renderKort({ ...baseEgenAktivitet, avtalt: false });
        expect(screen.queryByText('Avtalt med Nav')).toBeNull();
    });

    it('should show "Slettet" tag when transaksjonsType is KASSERT', async () => {
        renderKort({ ...baseEgenAktivitet, avtalt: true, transaksjonsType: FellesTransaksjonsTyper.KASSERT });
        expect(await screen.findByText('Slettet')).toBeInTheDocument();
    });

    it('should NOT show "Slettet" for non-kassert aktiviteter', () => {
        renderKort({ ...baseEgenAktivitet, avtalt: true, transaksjonsType: FellesTransaksjonsTyper.OPPRETTET });
        expect(screen.queryByText('Slettet')).toBeNull();
    });

    it('should show "Samtalereferatet er ikke delt" (veileder) for SAMTALEREFERAT with unpublished referat', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: SAMTALEREFERAT_TYPE as VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
            fraDato: new Date().toISOString(),
            kanal: 'OPPMOTE',
            referat: 'noe',
            erReferatPublisert: false,
        };
        renderKort(aktivitet, { erVeileder: true });
        expect(await screen.findByText('Samtalereferatet er ikke delt')).toBeInTheDocument();
    });

    it('should show "Samtalereferatet er ikke ferdig" (bruker) for SAMTALEREFERAT with unpublished referat', async () => {
        const aktivitet = {
            ...baseEgenAktivitet,
            type: SAMTALEREFERAT_TYPE as VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
            fraDato: new Date().toISOString(),
            kanal: 'OPPMOTE',
            referat: 'noe',
            erReferatPublisert: false,
        };
        const store = configureStore({
            reducer: rootReducer,
            preloadedState: {
                ...(gitt().createStore().getState() as RootState),
                data: {
                    ...(gitt().createStore().getState() as RootState).data,
                    identitet: { status: Status.OK, data: { id: 'bruker1', erVeileder: false, erBruker: true } },
                },
            },
        });
        renderKort(aktivitet, { store, erVeileder: false });
        expect(await screen.findByText('Samtalereferatet er ikke ferdig')).toBeInTheDocument();
    });

    it('should show "Samtalereferatet er ikke delt" for MOTE with referat that is unpublished', async () => {
        const mote = enMoteAktivitet(); // has referat + erReferatPublisert: false
        renderKort(mote, { erVeileder: true });
        expect(await screen.findByText('Samtalereferatet er ikke delt')).toBeInTheDocument();
    });

    it('should NOT show referat warning for MOTE when referat is published', () => {
        const mote = { ...enMoteAktivitet(), erReferatPublisert: true };
        renderKort(mote);
        expect(screen.queryByText(/Samtalereferatet/)).toBeNull();
    });

    it('should NOT show referat warning for MOTE without referat content', () => {
        const mote = { ...enMoteAktivitet(), referat: '' };
        renderKort(mote);
        expect(screen.queryByText(/Samtalereferatet/)).toBeNull();
    });

    it('should show StillingFraNav soknadsstatus "Venter på å bli kontaktet"', async () => {
        renderKort(enStillingFraNavAktivitet({ tittel: 'Stilling' }));
        expect(await screen.findByText('Venter på å bli kontaktet')).toBeInTheDocument();
    });

    it('should show StillingFraNav soknadsstatus "CV er delt med arbeidsgiver"', async () => {
        const aktivitet = {
            ...enStillingFraNavAktivitet({ tittel: 'Stilling' }),
            stillingFraNavData: { ...enStillingFraNavData, soknadsstatus: StillingFraNavSoknadsstatus.CV_DELT },
        };
        renderKort(aktivitet);
        expect(await screen.findByText('CV er delt med arbeidsgiver')).toBeInTheDocument();
    });

    it('should show StillingEtikett "Sendt søknad" for STILLING with etikett SOKNAD_SENDT', async () => {
        const aktivitet = { ...enStillingAktivitet({ tittel: 'Stilling' }), etikett: 'SOKNAD_SENDT' };
        renderKort(aktivitet);
        expect(await screen.findByText('Sendt søknad')).toBeInTheDocument();
    });

    it('should show dialog icon when a dialog with henvendelser exists', async () => {
        const dialog: Dialog = {
            id: 'dialog-1',
            aktivitetId: AKTIVITET_ID,
            overskrift: 'Testdialog',
            sisteDato: new Date().toISOString(),
            opprettetDato: new Date().toISOString(),
            oppfolgingsperiode: PERIODE_ID,
            henvendelser: [
                {
                    id: 'h1',
                    dialogId: 'dialog-1',
                    tekst: 'Hei',
                    avsender: 'BRUKER',
                    sendt: new Date().toISOString(),
                    lest: true,
                },
            ],
        };
        renderKort(baseEgenAktivitet, { store: lagStoreWithDialog([dialog]) });
        expect(await screen.findByRole('img', { name: /ingen uleste meldinger/i })).toBeInTheDocument();
    });

    it('should show unread dialog icon when dialog has unread henvendelser', async () => {
        const dialog: Dialog = {
            id: 'dialog-2',
            aktivitetId: AKTIVITET_ID,
            overskrift: 'Testdialog',
            sisteDato: new Date().toISOString(),
            opprettetDato: new Date().toISOString(),
            oppfolgingsperiode: PERIODE_ID,
            henvendelser: [
                {
                    id: 'h1',
                    dialogId: 'dialog-2',
                    tekst: 'Ulest',
                    avsender: 'BRUKER',
                    sendt: new Date().toISOString(),
                    lest: false,
                },
            ],
        };
        renderKort(baseEgenAktivitet, { store: lagStoreWithDialog([dialog]) });
        expect(await screen.findByRole('img', { name: /aktiviteten har uleste meldinger/i })).toBeInTheDocument();
    });

    it('should show ekstern etikett "Søkt inn på tiltaket" for EKSTERN_AKTIVITET_TYPE', async () => {
        const eksternAktivitet = {
            ...baseEgenAktivitet,
            type: VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE,
            eksternAktivitet: {
                type: 'ARENA_TILTAK',
                etiketter: [{ kode: 'SOKT_INN' }],
            },
        };
        renderKort(eksternAktivitet);
        expect(await screen.findByText('Søkt inn på tiltaket')).toBeInTheDocument();
    });

    it('should show arbeidsgiver for stillingFraNav aktiviteter', async () => {
        const { getByText } = renderKort(stillingAktivitet);
        getByText('Arbeidsgiver for stillingsaktivitet');
    });

    it('should show antall soknader i uken for sokeavtale', async () => {
        const { getByText } = renderKort(sokeAvtaleAktivitet);
        getByText('Antall søknader i uken 5');
    });
});

// ============================================================
// Aktivitetskort own business logic — harEndringerIAktivitet
// ============================================================

describe('Aktivitetskort — endring-markering', () => {
    it('should show new-change indicator when aktivitet was changed after lest tidspunkt by someone else', async () => {
        const recentEndring = new Date().toISOString();
        const gammeltLest = subDays(new Date(), 2).toISOString();

        const aktivitet = {
            ...baseEgenAktivitet,
            // endret by NAV (not the bruker in identitet), after lest
            endretDato: recentEndring,
            endretAvType: 'NAV' as const,
            endretAv: 'Z999999', // different from identitet.id
        };
        const store = lagStoreWithLest(gammeltLest, 'bruker1');
        renderKort(aktivitet, { store, erVeileder: false });
        // NotifikasjonMarkering renders an SVG with title "Ulest aktivitet"
        expect(await screen.findByTitle('Ulest aktivitet')).toBeInTheDocument();
    });

    it('should NOT show new-change indicator when the current user made the last change', async () => {
        const gammeltLest = subDays(new Date(), 2).toISOString();
        const aktivitet = {
            ...baseEgenAktivitet,
            endretDato: new Date().toISOString(),
            endretAvType: 'BRUKER' as const,
            endretAv: 'bruker1',
        };
        const store = lagStoreWithLest(gammeltLest, 'bruker1');
        renderKort(aktivitet, { store, erVeileder: false });
        expect(screen.queryByTitle('Ulest aktivitet')).toBeNull();
    });
});
