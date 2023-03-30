import { subMonths } from 'date-fns';

import { ArenaAktivitetType } from '../../datatypes/arenaAktivitetTypes';
import { VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import {
    beregnFraTil,
    beregnKlokkeslettVarighet,
    formatterKlokkeslett,
    formatterVarighet,
    splitIEldreOgNyereAktiviteter,
} from './aktivitet-util';
import { kanEndreAktivitetDetaljer } from './aktivitetlisteSelector';

/* eslint-env mocha */

describe('aktivitet-util', () => {
    it('beregnFraTil', () => {
        const fraTil = beregnFraTil({
            dato: '2017-08-01T00:00:00.000+02:00',
            klokkeslett: '15:00',
            varighet: '00:15',
        });
        expect(fraTil.fraDato).toEqual('2017-08-01T13:00:00.000Z');
        expect(fraTil.tilDato).toEqual('2017-08-01T13:15:00.000Z');

        expect(beregnFraTil({})).toEqual({});
    });

    it('beregnKlokkeslettVarighet', () => {
        const klokkeslettVarighet = beregnKlokkeslettVarighet({
            fraDato: '2017-08-01T04:00:00.000+02:00',
            tilDato: '2017-08-01T06:15:00.000+02:00',
        });
        expect(klokkeslettVarighet.klokkeslett).toEqual('04:00');
        expect(klokkeslettVarighet.varighet).toEqual(135);
        expect(klokkeslettVarighet.dato).toEqual(new Date('2017-07-31T22:00:00.000Z'));

        expect(beregnKlokkeslettVarighet({})).toBeUndefined();
    });

    it('beregnFraTil + beregnKlokkeslettVarighet', () => {
        const fraDato = '2017-08-01T04:00:00.000Z';
        const tilDato = '2017-08-01T06:15:00.000Z';

        const moteTid = beregnKlokkeslettVarighet({
            fraDato,
            tilDato,
        });
        const fraTil = beregnFraTil(moteTid);

        expect(fraTil.fraDato).toEqual(fraDato);
        expect(fraTil.tilDato).toEqual(tilDato);
    });

    it('formatterVarighet', () => {
        expect(formatterVarighet(90)).toEqual('01:30');
    });

    it('formatterKlokkeslett', () => {
        expect(formatterKlokkeslett('1:15')).toEqual('01:15');
        expect(formatterKlokkeslett('115')).toEqual(undefined);
    });

    it.skip('skal splitte basert på sorteringsdato hvor sorteringsdato er endretDato > tilDato > fraDato', () => {
        const treManederSiden = subMonths(new Date(), 3);
        const now = new Date();

        const manglerAlleDatoer = { endretDato: null, tilDato: null, fraDato: null };
        const manglendeEndretDato = { endretDato: null, tilDato: null, fraDato: treManederSiden };
        const bareNyereTilDato = { endretDato: null, tilDato: now, fraDato: null };
        const bareEldreTilDato = { endretDato: null, tilDato: treManederSiden, fraDato: null };
        const endretDatoMerEnnToManederSiden = { endretDato: treManederSiden, tilDato: now, fraDato: undefined };
        const endretDatoMindreEnnToManederSiden = { endretDato: now, tilDato: treManederSiden, fraDato: null };

        const aktiviteter = [
            manglerAlleDatoer,
            bareNyereTilDato,
            bareEldreTilDato,
            manglendeEndretDato,
            endretDatoMerEnnToManederSiden,
            endretDatoMindreEnnToManederSiden,
        ];

        const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(aktiviteter);

        expect(nyereAktiviteter).toEqual([manglerAlleDatoer, bareNyereTilDato, endretDatoMindreEnnToManederSiden]);
        expect(eldreAktiviteter).toEqual([bareEldreTilDato, manglendeEndretDato, endretDatoMerEnnToManederSiden]);
    });

    describe('kanEndreAktivitetDetaljer', () => {
        const baseAktivitet = { avtalt: false, historisk: false, type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE };
        it('bare veileder kan endre samtalereferat', () => {
            const aktivitet = { ...baseAktivitet, type: VeilarbAktivitetType.SAMTALEREFERAT_TYPE };
            expect(kanEndreAktivitetDetaljer(aktivitet, false)).toBeFalsy();
            expect(kanEndreAktivitetDetaljer(aktivitet, true)).toBeTruthy();
        });
        it('bruker og veileder kan endre medisinsk behandling som ikke er avtalt', () => {
            const aktivitet = { ...baseAktivitet, type: VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE };
            expect(kanEndreAktivitetDetaljer(aktivitet, false)).toBeTruthy();
            expect(kanEndreAktivitetDetaljer(aktivitet, true)).toBeTruthy();
            expect(kanEndreAktivitetDetaljer(aktivitet, true)).toBeTruthy();
        });
        it('bare veileder kan endre avtalte aktiviteter utenom medisinsk behandling og samtalereferat', () => {
            [
                VeilarbAktivitetType.MOTE_TYPE,
                VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE,
                VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE,
                VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
            ].forEach((type) => {
                const aktivitet = {
                    ...baseAktivitet,
                    type,
                    avtalt: true,
                };
                expect(kanEndreAktivitetDetaljer(aktivitet, false)).toBeFalsy();
                expect(kanEndreAktivitetDetaljer(aktivitet, true)).toBeTruthy();
            });
        });

        describe('aktiviteter styrt eksternt kan ikke endres av noen', () => {
            it('Arenaaktiviteter', () => {
                const aktivitet = { ...baseAktivitet, type: ArenaAktivitetType.GRUPPEAKTIVITET };
                expect(kanEndreAktivitetDetaljer(aktivitet, false)).toBeFalsy();
            });
            it('Eksterne aktiviteter', () => {
                const aktivitet = { ...baseAktivitet, type: VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE };
                expect(kanEndreAktivitetDetaljer(aktivitet, false)).toBeFalsy();
            });
            it('Stilling fra NAV', () => {
                const aktivitet = { ...baseAktivitet, type: VeilarbAktivitetType.STILLING_FRA_NAV_TYPE };
                expect(kanEndreAktivitetDetaljer(aktivitet, false)).toBeFalsy();
            });
        });
    });
});
