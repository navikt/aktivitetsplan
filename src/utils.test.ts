import {
    datoComparator,
    erGyldigISODato,
    formaterDatoKortManed,
    formaterDatoKortManedTid,
    formaterDatoTid,
    formaterTid,
} from './utils/dateUtils';
import { autobind, erInternlenke, fn, guid, storeForbokstaver } from './utils/utils';

describe('app utils', () => {
    describe('fn', () => {
        it('Skal returnere en funksjon hva en som blir gitt som input', () => {
            const funksjon = () => 'en funksjon';
            const string = 'en string';

            expect(fn(funksjon)()).toEqual('en funksjon');
            expect(fn(string)()).toEqual('en string');
            expect(typeof fn('test')).toBe('function');
        });
    });

    describe('guid', () => {
        it('GUID skal følge standard format', () => {
            const id = guid();
            const guidParts = id.split('-');

            expect(guidParts.length).toEqual(5);
        });

        it('GUID skal være forskjellige', () => {
            const guid1 = guid();
            const guid2 = guid();

            expect(guid1 === guid2).toEqual(false);
        });
    });

    describe('autobind', () => {
        it('Skal kalle rebinde alle funksjoner på prototypen', () => {
            class Mock {
                constructor() {
                    autobind(this);
                }

                fn1() {
                    this.a = 1;
                }

                fn2() {
                    this.b = 1;
                }
            }

            const mock = new Mock();

            expect(mock.hasOwnProperty('fn1')).toEqual(true); // eslint-disable-line no-prototype-builtins
            expect(mock.hasOwnProperty('fn2')).toEqual(true); // eslint-disable-line no-prototype-builtins
        });

        it('Skal håndertere verdier på prototypen', () => {
            class Mock {
                constructor() {
                    autobind(this);
                }

                fn3() {
                    this.c = 1;
                }
            }
            Mock.prototype.val1 = 'abba';

            new Mock(); // eslint-disable-line no-new

            expect(true).toEqual(true); // Skal ikke kaste error
        });
    });

    describe('erInternlenke', () => {
        it('Skal kjenne igjen en ekstern lenke', () => {
            const httpsHref = 'https://www.nrk.no/';
            const httpHref = 'http://www.nrk.no/';

            expect(erInternlenke(httpsHref)).toEqual(false);
            expect(erInternlenke(httpHref)).toEqual(false);
            expect(erInternlenke('/a/b/c')).toEqual(true);
            expect(erInternlenke(null)).toEqual(false);
            expect(erInternlenke(undefined)).toEqual(false);
        });
    });

    describe('erGyldigISODato', () => {
        it('Tolker ISO-datoer riktig', () => {
            expect(erGyldigISODato('2014-02-13T23:00:00.000Z')).toEqual(true);
            expect(erGyldigISODato('2014-02-13T23:00:00.000+0000')).toEqual(true);
            expect(erGyldigISODato('2014-02-13')).toEqual(true);
            expect(erGyldigISODato('13.02.2014')).toEqual(false);
            expect(erGyldigISODato('')).toEqual(false);
            expect(erGyldigISODato(null)).toEqual(false);
            expect(erGyldigISODato(undefined)).toEqual(false);
        });
    });

    describe('formaterDatoTid', () => {
        it('Formater datoer riktig', () => {
            expect(formaterDatoTid(null)).toBeUndefined();
            expect(formaterDatoTid(undefined)).toBeUndefined();
            const zuluDate = new Date('2014-02-13T14:23:21.123Z');
            expect(formaterDatoTid('2014-02-13T14:23:21.123Z')).toEqual(
                `13.02.2014 ${zuluDate.getHours()}:${zuluDate.getMinutes()}`
            ); // NB zulu-time != paris-time
        });
    });

    describe('formaterDatoKortManed', () => {
        it('Formater datoer riktig', () => {
            expect(formaterDatoKortManed(null)).toBeUndefined();
            expect(formaterDatoKortManed(undefined)).toBeUndefined();
            expect(formaterDatoKortManed('2014-02-13T14:21:21.123Z')).toEqual('13. feb. 2014'); // NB zulu-time != paris-time
        });
    });

    describe('formaterDatoKortManedTid', () => {
        it('Formater datoer riktig', () => {
            expect(formaterDatoKortManedTid(null)).toBeUndefined();
            expect(formaterDatoKortManedTid(undefined)).toBeUndefined();
            const zuluDate = new Date('2014-02-13T14:23:21.123Z');
            expect(formaterDatoKortManedTid('2014-02-13T14:23:21.123Z')).toEqual(
                `13. feb. 2014 kl ${zuluDate.getHours()}:${zuluDate.getMinutes()}`
            ); // NB zulu-time != paris-time
        });
    });

    describe('formaterTid', () => {
        it('Formater datoer riktig', () => {
            expect(formaterTid(null)).toBeUndefined();
            expect(formaterTid(undefined)).toBeUndefined();
            const zuluDate = new Date('2014-02-13T14:23:21.123Z');
            expect(formaterTid('2014-02-13T14:23:21.123Z')).toEqual(`${zuluDate.getHours()}:${zuluDate.getMinutes()}`); // NB zulu-time != paris-time
        });
    });

    describe('datoComparator', () => {
        it('Returner 0 ved like datoer', () => {
            expect(datoComparator('2014-02-13T23:00:00.000Z', '2014-02-13T23:00:00.000Z')).toEqual(0);
        });

        it('Returner > 0 hvis venstre er senere enn høyre', () => {
            expect(datoComparator('2014-02-16T23:00:00.000Z', '2014-02-13T23:00:00.000Z')).toBeGreaterThan(0);
        });

        it('Returner < 0 hvis venstre er tidligere enn høyre', () => {
            expect(datoComparator('2014-02-13T23:00:00.000Z', '2014-02-16T23:00:00.000Z')).toBeLessThan(0);
        });

        it('Fornuftig håndtering av null og undefined', () => {
            expect(datoComparator('2014-02-13T23:00:00.000Z', null)).toBeGreaterThan(0);
            expect(datoComparator('2014-02-13T23:00:00.000Z', undefined)).toBeGreaterThan(0);

            expect(datoComparator(null, '2014-02-16T23:00:00.000Z')).toBeLessThan(0);
            expect(datoComparator(undefined, '2014-02-16T23:00:00.000Z')).toBeLessThan(0);
        });
    });

    describe('storeForbokstaver', () => {
        it('Formatterer ord med stor forbokstav', () => {
            expect(storeForbokstaver('KARI')).toEqual('Kari');
            expect(storeForbokstaver('PER OLAV KNUTSON')).toEqual('Per Olav Knutson');
            expect(storeForbokstaver('pelle parafin')).toEqual('Pelle Parafin');
            expect(storeForbokstaver('FORNAVN', 'MELLOMNAVN', 'ETTERNAVN')).toEqual('Fornavn Mellomnavn Etternavn');
            expect(storeForbokstaver('FORNAVN', undefined, 'ETTERNAVN')).toEqual('Fornavn Etternavn');
            expect(storeForbokstaver('', null, 'ETTERNAVN')).toEqual('Etternavn');
            expect(storeForbokstaver(null)).toEqual('');
            expect(storeForbokstaver(undefined)).toEqual('');
        });
    });
});
