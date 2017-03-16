/* eslint-env mocha */
import { expect } from 'chai';
import { sjekkStatuskode, toJson, getCookie } from './utils';

describe('utils', () => {
    describe('Sjekk-statuskode', () => {
        it('Skal returnere response når status er ok', () => {
            const response = {
                ok: true,
                status: 200,
                statusText: 'Status OK'
            };
            expect(sjekkStatuskode(response)).to.deep.equal(response);
        });
        it('Skal returnere error når respons ikke er ok', () => {
            const response = {
                ok: false,
                status: 200,
                statusText: 'Feilstatus'
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
        it('Skal returnere error når status er over 299', () => {
            const response = {
                ok: true,
                status: 300,
                statusText: 'Feilstatus'
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
        it('Skal returnere error når status er under 200', () => {
            const response = {
                ok: true,
                status: 199,
                statusText: 'Feilstatus'
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
        it('Skal returnere error når statuskode er under 200 og ok er false', () => {
            const response = {
                ok: false,
                status: 199,
                statusText: 'Feilstatus'
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
    });
    describe('toJson', () => {
        it('Sjekk at funksjonen returnere json ved gyldig status', () => {
            const response = {
                status: 200,
                json: () => ({ testprop: 'testprop' })
            };
            expect(toJson(response)).to.deep.equal(response.json());
        });
        it('Returnerer respons ved 204', () => {
            const response = {
                status: 204,
                json: () => ({ testprop: 'testprop' })
            };
            expect(toJson(response)).to.deep.equal(response);
        });
    });
    describe('getCookie', () => {
        it('Henter ut fra cookie', () => {
            global.document.cookie = 'test1=detteerentest123; test2=detteerogsåentest123';
            expect(getCookie('test1')).to.equal('detteerentest123');
        });
        it('Tom streng ved ingen match', () => {
            global.document.cookie = 'test1=detteerentest123; test2=detteerogsåentest123';
            expect(getCookie('test0')).to.equal('');
        });
    });
});

