/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { sjekkStatuskode, handterFeil, toJson, getCookie } from './utils';

describe('utils', () => {
    describe('Sjekk-statuskode', () => {
        it('Skal returnere response når status er ok', () => {
            const response = {
                ok: true,
                status: 200,
                statusText: 'Status OK',
            };
            expect(sjekkStatuskode(response)).to.deep.equal(response);
        });
        it('Skal returnere error når respons ikke er ok', () => {
            const response = {
                ok: false,
                status: 200,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
        it('Skal returnere error når status er over 299', () => {
            const response = {
                ok: true,
                status: 300,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
        it('Skal returnere error når status er under 200', () => {
            const response = {
                ok: true,
                status: 199,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
        it('Skal returnere error når statuskode er under 200 og ok er false', () => {
            const response = {
                ok: false,
                status: 199,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).to.throw(Error);
        });
    });

    describe('handterFeil', () => {
        const action = 'action';

        it('Sjekk at funksjonen returnerer et rejected promise', () => {
            // eslint-disable-next-line no-unused-expressions
            expect(handterFeil(sinon.spy(), action)(new Error('message'))).to.be
                .rejected;
        });
        it('Sjekk at funksjonen dispatcher parset feil', done => {
            const dispatch = sinon.spy();
            const response = {
                text: () => Promise.resolve('{"type":"FEILTYPE"}'),
            };
            handterFeil(dispatch, action)({ response });
            setTimeout(() => {
                expect(dispatch).to.be.calledWith({
                    data: { type: 'FEILTYPE' },
                    type: action,
                });
                done();
            }, 0);
        });
        it('Sjekk at funksjonen dispatcher error message', () => {
            const dispatch = sinon.spy();
            const error = new Error('message');
            handterFeil(dispatch, action)(error);
            expect(dispatch).to.be.calledWith({
                data: error.toString(),
                type: action,
            });
        });
    });

    describe('toJson', () => {
        it('Sjekk at funksjonen returnere json ved gyldig status', () => {
            const response = {
                status: 200,
                json: () => ({ testprop: 'testprop' }),
            };
            expect(toJson(response)).to.deep.equal(response.json());
        });
        it('Returnerer respons ved 204', () => {
            const response = {
                status: 204,
                json: () => ({ testprop: 'testprop' }),
            };
            expect(toJson(response)).to.deep.equal(response);
        });
    });
    describe('getCookie', () => {
        it('Henter ut fra cookie', () => {
            global.document.cookie =
                'test1=detteerentest123; test2=detteerogsåentest123';
            expect(getCookie('test1')).to.equal('detteerentest123');
        });
        it('Tom streng ved ingen match', () => {
            global.document.cookie =
                'test1=detteerentest123; test2=detteerogsåentest123';
            expect(getCookie('test0')).to.equal('');
        });
    });
});
