/* eslint-env mocha */
import { expect } from 'chai';
import { dateGreaterOrEqual, dateLessOrEqual, validerPeriode } from './utils';

describe('utils', () => {
    describe('dateLessOrEqual', () => {
        it('Skal returnere true når året i dato1 er mindre enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();

            date1.setYear(date2.getFullYear() - 1);

            expect(dateLessOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene er de samme, men mnd i dato1 er mindre enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();

            date1.setMonth(date2.getMonth() - 1);

            expect(dateLessOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene og mnd er de samme, men dagen i dato1 er mindre enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();

            date1.setDate(date2.getDate() - 1);

            expect(dateLessOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når datoene er de samme, uten å bry som om klokkeslettet', () => {

            const date1 = new Date();
            const date2 = new Date();

            expect(dateLessOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere false hvis dato1 er større enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();

            date1.setYear(date1.getFullYear() + 1);

            expect(dateLessOrEqual(date1, date2)).to.equal(false);
        });
    });

    describe('dateGreaterOrEqual', () => {
        it('Skal returnere true når året i dato1 er større enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();


            date1.setYear(date2.getFullYear() + 1);
            console.log(date1);
            console.log(date2);

            expect(dateGreaterOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene er de samme, men mnd i dato1 er større enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();

            date1.setMonth(date2.getMonth() + 1);

            expect(dateGreaterOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene og mnd er de samme, men dagen i dato1 er mindre enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();

            date1.setDate(date2.getDate() + 1);

            expect(dateGreaterOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når datoene er de samme, uten å bry som om klokkeslettet', () => {

            const date1 = new Date();
            const date2 = new Date();

            expect(dateGreaterOrEqual(date1, date2)).to.equal(true);
        });
        it('Skal returnere false hvis dato1 er mindre enn dato2', () => {

            const date1 = new Date();
            const date2 = new Date();

            date1.setYear(date1.getFullYear() - 1);

            expect(dateGreaterOrEqual(date1, date2)).to.equal(false);
        });

    });

    describe('validerPeriode', () => {
        it('Skal validere at input dato er før til datoen', () => {

            const input = new Date();
            const til = new Date();
            til.setDate(input.getDate() + 1);

            expect(validerPeriode(input, {til: til})).to.be.a('undefined');
            expect(validerPeriode(input, {til: input})).to.be.a('undefined');
            expect(validerPeriode(til, {til: input})).to.be.a('string');
        });

        it('Skal validere at input dato er etter fra datoen', () => {

            const input = new Date();
            const fra = new Date();
            fra.setDate(input.getDate() - 1);

            expect(validerPeriode(input, {fra: fra})).to.be.a('undefined');
            expect(validerPeriode(input, {fra: input})).to.be.a('undefined');
            expect(validerPeriode(fra, {fra: input})).to.be.a('string');
        });

        it('Skal validere at input dato er innenfor parioden fra og til', () => {

            const input = new Date();

            const fra = new Date();
            fra.setDate(input.getDate() - 1);

            const til = new Date();
            til.setDate(input.getDate() + 1);

            expect(validerPeriode(input, {fra: fra, til: til})).to.be.a('undefined');
            expect(validerPeriode(fra, {fra: input, til: til})).to.be.a('string');
            expect(validerPeriode(til, {fra: fra, til: input})).to.be.a('string');

        });
    });
});
