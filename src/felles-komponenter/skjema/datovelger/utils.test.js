/* eslint-env mocha */
import { expect } from 'chai';
import { dateGreater, dateLess } from './utils';

describe('utils', () => {
    describe('dateLess', () => {
        it('Skal returnere true når året i dato1 er mindre enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setYear(date2.getFullYear() - 1);

            expect(dateLess(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene er de samme, men mnd i dato1 er mindre enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setMonth(date2.getMonth() - 1);

            expect(dateLess(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene og mnd er de samme, men dagen i dato1 er mindre enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setDate(date2.getDate() - 1);

            expect(dateLess(date1, date2)).to.equal(true);
        });
        it('Skal returnere false hvis dato1 er større enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setYear(date1.getFullYear() + 1);

            expect(dateLess(date1, date2)).to.equal(false);
        });
    });

    describe('dateGreater', () => {
        it('Skal returnere true når året i dato1 er større enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setYear(date2.getFullYear() + 1);

            expect(dateGreater(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene er de samme, men mnd i dato1 er større enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setMonth(date2.getMonth() + 1);

            expect(dateGreater(date1, date2)).to.equal(true);
        });
        it('Skal returnere true når årene og mnd er de samme, men dagen i dato1 er mindre enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setDate(date2.getDate() + 1);

            expect(dateGreater(date1, date2)).to.equal(true);
        });
        it('Skal returnere false hvis dato1 er mindre enn dato2', () => {
            const date1 = new Date();
            const date2 = new Date();

            date1.setYear(date1.getFullYear() - 1);

            expect(dateGreater(date1, date2)).to.equal(false);
        });
    });
});
