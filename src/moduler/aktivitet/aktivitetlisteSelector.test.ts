import { describe, expect, it } from 'vitest';

import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { AktivitetsId, OppfolgingsPeriodeId } from '../../datatypes/brandedTypes';
import { VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { enEgenAktivitet } from '../../mocks/fixtures/egenAktivitet';
import { defaultAktivPeriode } from '../../testUtils/store/defaultInitialStore';
import { gitt } from '../../testUtils/store/mockStoreBuilder';
import { toggleAktivitetsType } from '../filtrering/filter/filter-slice';
import { velgPeriode } from '../filtrering/filter/valgt-periode-slice';
import { flyttAktivitet } from './aktivitet-actions';
import { selectSorterteKolonneAktiviteter, startDragging } from './aktivitet-kort/dragAndDropSlice';
import { selectAktivitetListe } from './aktivitetlisteSelector';

const aktivitet = enEgenAktivitet({
    id: 'memoized-activity' as AktivitetsId,
    tittel: 'Memoized activity',
    oppfolgingsperiodeId: defaultAktivPeriode.id,
});

function createStore() {
    const store = gitt().aktiviteter.medAktiviteter([aktivitet]).createStore();
    store.dispatch(velgPeriode(defaultAktivPeriode.id));
    return store;
}

describe('Activity list memoization', () => {
    it('reuses both results when unrelated drag state changes', () => {
        const store = createStore();
        const aktiviteter = selectAktivitetListe(store.getState());
        const kolonne = selectSorterteKolonneAktiviteter(store.getState(), aktivitet.status);
        const listeRecomputations = selectAktivitetListe.recomputations();
        const kolonneRecomputations = selectSorterteKolonneAktiviteter.recomputations();

        store.dispatch(startDragging(aktivitet));

        expect(selectAktivitetListe(store.getState())).toBe(aktiviteter);
        expect(selectSorterteKolonneAktiviteter(store.getState(), aktivitet.status)).toBe(kolonne);
        expect(selectAktivitetListe.recomputations()).toBe(listeRecomputations);
        expect(selectSorterteKolonneAktiviteter.recomputations()).toBe(kolonneRecomputations);
    });

    it('caches results for multiple column statuses', () => {
        const store = createStore();
        const planlagt = selectSorterteKolonneAktiviteter(store.getState(), AktivitetStatus.PLANLAGT);
        const gjennomfoert = selectSorterteKolonneAktiviteter(store.getState(), AktivitetStatus.GJENNOMFOERT);
        const recomputations = selectSorterteKolonneAktiviteter.recomputations();

        expect(planlagt).toEqual([aktivitet]);
        expect(gjennomfoert).toEqual([]);
        expect(selectSorterteKolonneAktiviteter(store.getState(), AktivitetStatus.PLANLAGT)).toBe(planlagt);
        expect(selectSorterteKolonneAktiviteter(store.getState(), AktivitetStatus.GJENNOMFOERT)).toBe(gjennomfoert);
        expect(selectSorterteKolonneAktiviteter.recomputations()).toBe(recomputations);
    });

    it('updates both results when filters or the selected period change', () => {
        const store = createStore();
        const aktiviteter = selectAktivitetListe(store.getState());
        expect(aktiviteter).toEqual([aktivitet]);

        store.dispatch(toggleAktivitetsType(VeilarbAktivitetType.MOTE_TYPE));

        expect(selectAktivitetListe(store.getState())).toEqual([]);
        expect(selectAktivitetListe(store.getState())).not.toBe(aktiviteter);
        expect(selectSorterteKolonneAktiviteter(store.getState(), aktivitet.status)).toEqual([]);

        store.dispatch(toggleAktivitetsType(VeilarbAktivitetType.MOTE_TYPE));
        expect(selectAktivitetListe(store.getState())).toEqual([aktivitet]);

        store.dispatch(velgPeriode('other-period' as OppfolgingsPeriodeId));

        expect(selectAktivitetListe(store.getState())).toEqual([]);
        expect(selectSorterteKolonneAktiviteter(store.getState(), aktivitet.status)).toEqual([]);
    });

    it('updates both results when activity data changes', () => {
        const store = createStore();
        const aktiviteter = selectAktivitetListe(store.getState());
        const oppdatert = { ...aktivitet, status: AktivitetStatus.GJENNOMFOERT };

        store.dispatch(
            flyttAktivitet.fulfilled(oppdatert, 'request-id', {
                aktivitet,
                status: oppdatert.status,
            }),
        );

        expect(selectAktivitetListe(store.getState())).not.toBe(aktiviteter);
        expect(selectAktivitetListe(store.getState())).toEqual([oppdatert]);
        expect(selectSorterteKolonneAktiviteter(store.getState(), AktivitetStatus.PLANLAGT)).toEqual([]);
        expect(selectSorterteKolonneAktiviteter(store.getState(), AktivitetStatus.GJENNOMFOERT)).toEqual([oppdatert]);
    });
});
