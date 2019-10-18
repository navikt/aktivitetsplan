/* eslint-env mocha */
import { moment } from '../../utils';
import {
    beregnFraTil,
    beregnKlokkeslettVarighet,
    formatterKlokkeslett,
    formatterVarighet,
    splitIEldreOgNyereAktiviteter
} from './aktivitet-util';

describe('aktivitet-util', () => {
    it('beregnFraTil', () => {
        const fraTil = beregnFraTil({
            dato: '2017-08-01T00:00:00.000+02:00',
            klokkeslett: 15,
            varighet: 15
        });
        expect(fraTil.fraDato).toEqual('2017-07-31T22:15:00.000Z');
        expect(fraTil.tilDato).toEqual('2017-07-31T22:30:00.000Z');

        expect(beregnFraTil({})).toEqual({});
    });

    it('beregnKlokkeslettVarighet', () => {
        const klokkeslettVarighet = beregnKlokkeslettVarighet({
            fraDato: '2017-08-01T04:00:00.000+02:00',
            tilDato: '2017-08-01T06:15:00.000+02:00'
        });
        expect(klokkeslettVarighet.klokkeslett).toEqual(240);
        expect(klokkeslettVarighet.varighet).toEqual(120 + 15);
        expect(klokkeslettVarighet.dato).toEqual('2017-07-31T22:00:00.000Z');

        expect(beregnKlokkeslettVarighet({})).toEqual({});
    });

    it('beregnFraTil + beregnKlokkeslettVarighet', () => {
        const fraDato = '2017-08-01T04:00:00.000Z';
        const tilDato = '2017-08-01T06:15:00.000Z';

        const fraTil = beregnFraTil(
            beregnKlokkeslettVarighet(
                beregnFraTil(
                    beregnKlokkeslettVarighet({
                        fraDato,
                        tilDato
                    })
                )
            )
        );

        expect(fraTil.fraDato).toEqual(fraDato);
        expect(fraTil.tilDato).toEqual(tilDato);
    });

    it('formatterVarighet', () => {
        expect(formatterVarighet(90)).toEqual('1:30');
    });

    it('formatterKlokkeslett', () => {
        expect(formatterKlokkeslett(75)).toEqual('1:15');
    });

    it('skallSplitteRiktigt', () => {
        const mangladeTilDato = [{ tilDato: null }];
        const tilDatoMerEnnToManederSiden = {
            tilDato: moment()
                .subtract(3, 'month')
                .format()
        };
        const tilDatoMindreEnnToManederSiden = { tilDato: moment().format() };
        const aktiviteter = [mangladeTilDato, tilDatoMerEnnToManederSiden, tilDatoMindreEnnToManederSiden];
        const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(aktiviteter);
        expect(nyereAktiviteter).toEqual([mangladeTilDato, tilDatoMindreEnnToManederSiden]);
        expect(eldreAktiviteter).toEqual([tilDatoMerEnnToManederSiden]);
    });
});
