import { STATUS, aggregerStatus, getCookie, sjekkStatuskode, toJson } from './utils';

const { OK, PENDING, ERROR, RELOADING, NOT_STARTED } = STATUS;

describe('utils', () => {
    describe('aggregerStatus', () => {
        it('alt OK gir OK', () => {
            expect(aggregerStatus(OK, OK, OK)).toEqual(OK);
        });
        it('RELOADING overstyrer OK', () => {
            expect(aggregerStatus(OK, RELOADING, OK)).toEqual(RELOADING);
        });
        it('PENDING overstyrer OK og RELOADING', () => {
            expect(aggregerStatus(OK, PENDING, OK)).toEqual(PENDING);
            expect(aggregerStatus(RELOADING, PENDING, RELOADING)).toEqual(PENDING);
        });
        it('NOT_STARTED overstyrer OK, RELOADING og PENDING', () => {
            expect(aggregerStatus(OK, NOT_STARTED, OK)).toEqual(NOT_STARTED);
            expect(aggregerStatus(RELOADING, NOT_STARTED, RELOADING)).toEqual(NOT_STARTED);
            expect(aggregerStatus(PENDING, NOT_STARTED, PENDING)).toEqual(NOT_STARTED);
        });
        it('ERROR overstyrer alle andre statuser', () => {
            expect(aggregerStatus(OK, ERROR, OK)).toEqual(ERROR);
            expect(aggregerStatus(RELOADING, ERROR, RELOADING)).toEqual(ERROR);
            expect(aggregerStatus(PENDING, ERROR, PENDING)).toEqual(ERROR);
            expect(aggregerStatus(NOT_STARTED, ERROR, NOT_STARTED)).toEqual(ERROR);
        });

        it('ignorerer null/undefined', () => {
            expect(aggregerStatus(OK, null, OK, undefined)).toEqual(OK);
            expect(aggregerStatus(null, null)).toEqual(null);
            expect(aggregerStatus(undefined, undefined)).toEqual(undefined);
        });

        it('aksepterer reducere som argument', () => {
            expect(aggregerStatus(OK, { status: ERROR }, OK)).toEqual(ERROR);
        });
    });

    describe('Sjekk-statuskode', () => {
        it('Skal returnere response når status er ok', () => {
            const response = {
                ok: true,
                status: 200,
                statusText: 'Status OK',
            };
            expect(sjekkStatuskode(response)).toEqual(response);
        });
        it('Skal returnere error når respons ikke er ok', () => {
            const response = {
                ok: false,
                status: 200,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).toThrow(Error);
        });
        it('Skal returnere error når status er over 299', () => {
            const response = {
                ok: true,
                status: 300,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).toThrow(Error);
        });
        it('Skal returnere error når status er under 200', () => {
            const response = {
                ok: true,
                status: 199,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).toThrow(Error);
        });
        it('Skal returnere error når statuskode er under 200 og ok er false', () => {
            const response = {
                ok: false,
                status: 199,
                statusText: 'Feilstatus',
            };
            expect(() => sjekkStatuskode(response)).toThrow(Error);
        });
    });

    describe('toJson', () => {
        it('Sjekk at funksjonen returnere json ved gyldig status', () => {
            const response = {
                status: 200,
                json: () => ({ testprop: 'testprop' }),
            };
            expect(toJson(response)).toEqual(response.json());
        });
        it('Returnerer respons ved 204', () => {
            const response = {
                status: 204,
                json: () => ({ testprop: 'testprop' }),
            };
            expect(toJson(response)).toEqual(response);
        });
    });
    describe('getCookie', () => {
        it('Henter ut fra cookie', () => {
            global.document.cookie = 'test1=detteerentest123; test2=detteerogsåentest123';
            expect(getCookie('test1')).toEqual('detteerentest123');
        });
        it('Tom streng ved ingen match', () => {
            global.document.cookie = 'test1=detteerentest123; test2=detteerogsåentest123';
            expect(getCookie('test0')).toEqual('');
        });
    });
});
