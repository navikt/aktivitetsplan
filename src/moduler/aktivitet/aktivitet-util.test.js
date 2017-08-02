/* eslint-env mocha */
import { expect } from 'chai';
import {
    beregnFraTil,
    beregnKlokkeslettVarighet,
    formatterKlokkeslett,
    formatterVarighet,
} from './aktivitet-util';

describe('aktivitet-util', () => {
    it('beregnFraTil', () => {
        const fraTil = beregnFraTil({
            dato: '2017-08-01T00:00:00.000+02:00',
            klokkeslett: 15,
            varighet: 15,
        });
        expect(fraTil.fraDato).to.equal('2017-07-31T22:15:00.000Z');
        expect(fraTil.tilDato).to.equal('2017-07-31T22:30:00.000Z');

        expect(beregnFraTil({})).to.be.empty; // eslint-disable-line no-unused-expressions
    });

    it('beregnKlokkeslettVarighet', () => {
        const klokkeslettVarighet = beregnKlokkeslettVarighet({
            fraDato: '2017-08-01T04:00:00.000+02:00',
            tilDato: '2017-08-01T06:15:00.000+02:00',
        });
        expect(klokkeslettVarighet.klokkeslett).to.equal(240);
        expect(klokkeslettVarighet.varighet).to.equal(120 + 15);
        expect(klokkeslettVarighet.dato).to.equal('2017-07-31T22:00:00.000Z');

        expect(beregnKlokkeslettVarighet({})).to.be.empty; // eslint-disable-line no-unused-expressions
    });

    it('beregnFraTil + beregnKlokkeslettVarighet', () => {
        const fraDato = '2017-08-01T04:00:00.000Z';
        const tilDato = '2017-08-01T06:15:00.000Z';

        const fraTil = beregnFraTil(
            beregnKlokkeslettVarighet(
                beregnFraTil(
                    beregnKlokkeslettVarighet({
                        fraDato,
                        tilDato,
                    })
                )
            )
        );

        expect(fraTil.fraDato).to.equal(fraDato);
        expect(fraTil.tilDato).to.equal(tilDato);
    });

    it('formatterVarighet', () => {
        expect(formatterVarighet(90)).to.equal('1:30');
    });

    it('formatterKlokkeslett', () => {
        expect(formatterKlokkeslett(75)).to.equal('1:15');
    });
});
