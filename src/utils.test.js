/* eslint no-unused-expressions:0 */
/* eslint-env mocha, browser */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonchai from 'sinon-chai';
import moment from 'moment';
import * as Utils from './utils';

chai.use(sinonchai);

describe('app utils', () => {
    describe('fn', () => {
        it('Skal returnere en funksjon hva en som blir gitt som input', () => {
            const funksjon = () => 'en funksjon';
            const string = 'en string';

            expect(Utils.fn(funksjon)()).to.equal('en funksjon');
            expect(Utils.fn(string)()).to.equal('en string');
            expect(Utils.fn('test')).to.be.a('function');
        });
    });

    describe('guid', () => {
        it('GUID skal følge standard format', () => {
            const guid = Utils.guid();
            const guidParts = guid.split('-');

            expect(guidParts.length).to.equal(5);
        });

        it('GUID skal være forskjellige', () => {
            const guid1 = Utils.guid();
            const guid2 = Utils.guid();

            expect(guid1 === guid2).to.equal(false);
        });
    });

    describe('autobind', () => {
        it('Skal kalle rebinde alle funksjoner på prototypen', () => {
            class Mock {
                constructor() {
                    Utils.autobind(this);
                }

                fn1() {
                    this.a = 1;
                }

                fn2() {
                    this.b = 1;
                }
            }

            const mock = new Mock();

            expect(mock.hasOwnProperty('fn1')).to.equal(true); // eslint-disable-line no-prototype-builtins
            expect(mock.hasOwnProperty('fn2')).to.equal(true); // eslint-disable-line no-prototype-builtins
        });

        it('Skal håndertere verdier på prototypen', () => {
            class Mock {
                constructor() {
                    Utils.autobind(this);
                }

                fn3() {
                    this.c = 1;
                }
            }
            Mock.prototype.val1 = 'abba';

            new Mock(); // eslint-disable-line no-new

            expect(true).to.equal(true); // Skal ikke kaste error
        });
    });

    describe('throttle', () => {
        it('Skal returnere funksjon som kaller funksjonen den blir gitt', () => {
            const spy = sinon.spy();
            const throttledFn = Utils.throttle(spy);
            throttledFn();

            expect(spy).to.be.called;
        });

        it('Skal kunne deffinere egen threshold', () => {
            const spy = sinon.spy();
            const throttledFn = Utils.throttle(spy, 500);
            throttledFn();

            expect(spy).to.be.called;
        });
    });

    describe('erDev', () => {
        const originalWindow = window;
        before(() => {
            window = { location: { href: 'https://www.test.no' } }; // eslint-disable-line no-global-assign
        });
        after(() => {
            window = originalWindow; // eslint-disable-line no-global-assign
        });

        it('Skal gjenkjenne at applikasjonen ikke kjøres i dev-modus', () => {
            expect(Utils.erDev()).to.equal(false);
        });

        it('Skal gjenkjenne at applikasjonen kjøres i dev-modus', () => {
            window = { location: { href: 'https://www.test.no/debug=true' } }; // eslint-disable-line no-global-assign
            expect(Utils.erDev()).to.equal(true);

            window = { location: { href: 'devillo.no:8282.test.no/' } }; // eslint-disable-line no-global-assign
            expect(Utils.erDev()).to.equal(true);

            window = { location: { href: 'localhost:8282.test.no/' } }; // eslint-disable-line no-global-assign
            expect(Utils.erDev()).to.equal(true);
        });
    });

    describe('erInternlenke', () => {
        it('Skal kjenne igjen en ekstern lenke', () => {
            const httpsHref = 'https://www.nrk.no/';
            const httpHref = 'http://www.nrk.no/';

            expect(Utils.erInternlenke(httpsHref)).to.equal(false);
            expect(Utils.erInternlenke(httpHref)).to.equal(false);
        });
    });

    describe('proxy', () => {
        it('Skal kalle underliggende funksjon med riktige argumenter', () => {
            const spy = sinon.spy();
            const proxied = Utils.proxy(spy);

            proxied('abba', 2, {});

            expect(spy).to.be.calledWith('abba', 2, {});
        });

        it('Skal kjøre funkjsonene den får i riktig rekkefølge', () => {
            const before = sinon.spy();
            const after = sinon.spy();
            const spy = sinon.spy();
            const proxied = Utils.proxy(spy, { before, after });

            proxied('abba');

            expect(spy).to.be.calledWith('abba');
            expect(before).to.be.calledWith('abba');
            expect(after).to.be.calledWith('abba');
            expect(before).to.be.calledBefore(spy);
            expect(after).to.be.calledAfter(spy);
        });
    });

    describe('dateToISODate', () => {
        it('Skal formattere korrekt', () => {
            expect(Utils.dateToISODate(new Date(2014, 1, 14))).to.equal(
                '2014-02-13T23:00:00.000Z'
            );
        });

        it('Skal ikke formattere ugyldige eller tomme datoer', () => {
            expect(Utils.dateToISODate('14.02.2014')).to.equal('');
            expect(Utils.dateToISODate('ugyldig')).to.equal('');
            expect(Utils.dateToISODate('')).to.equal('');
            expect(Utils.dateToISODate(null)).to.equal('');
            expect(Utils.dateToISODate(undefined)).to.equal('');
        });
    });

    describe('datePickerToISODate', () => {
        it('Skal formattere korrekt', () => {
            expect(Utils.datePickerToISODate('14.02.2014')).to.equal(
                '2014-02-13T23:00:00.000Z'
            );
        });

        it('Skal ikke formattere ugyldige eller tomme datoer', () => {
            expect(Utils.datePickerToISODate('ugyldig')).to.equal('');
            expect(Utils.datePickerToISODate('')).to.equal('');
            expect(Utils.datePickerToISODate(null)).to.equal('');
            expect(Utils.datePickerToISODate(undefined)).to.equal('');
        });
    });

    describe('ISODateToDatePicker', () => {
        it('Skal formattere korrekt', () => {
            expect(
                Utils.ISODateToDatePicker('2014-02-13T23:00:00.000Z')
            ).to.equal('14.02.2014');
        });

        it('Skal ikke formattere ugyldige eller tomme datoer', () => {
            expect(Utils.ISODateToDatePicker('ugyldig')).to.equal('');
            expect(Utils.ISODateToDatePicker('')).to.equal('');
            expect(Utils.ISODateToDatePicker(null)).to.equal('');
            expect(Utils.ISODateToDatePicker(undefined)).to.equal('');
        });
    });

    describe('erGyldigISODato', () => {
        it('Tolker ISO-datoer riktig', () => {
            expect(Utils.erGyldigISODato('2014-02-13T23:00:00.000Z')).to.equal(
                true
            );
            expect(
                Utils.erGyldigISODato('2014-02-13T23:00:00.000+0000')
            ).to.equal(true);
            expect(Utils.erGyldigISODato('2014-02-13')).to.equal(true);
            expect(Utils.erGyldigISODato('13.02.2014')).to.equal(false);
            expect(Utils.erGyldigISODato('')).to.equal(false);
            expect(Utils.erGyldigISODato(null)).to.equal(false);
            expect(Utils.erGyldigISODato(undefined)).to.equal(false);
        });
    });

    describe('formaterDatoTid', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDatoTid(null)).to.not.exist;
            expect(Utils.formaterDatoTid(undefined)).to.not.exist;
            expect(Utils.formaterDatoTid('2014-02-13T14:23:21.123Z')).to.equal(
                '13.02.2014 15:23'
            ); // NB zulu-time != paris-time
        });
    });

    describe('formaterDato', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDato(null)).to.not.exist;
            expect(Utils.formaterDato(undefined)).to.not.exist;
            expect(Utils.formaterDato('2014-02-13T14:23:21.123Z')).to.equal(
                '13. feb 2014'
            );
        });
    });

    describe('formaterDatoKortManed', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDatoKortManed(null)).to.not.exist;
            expect(Utils.formaterDatoKortManed(undefined)).to.not.exist;
            expect(
                Utils.formaterDatoKortManed('2014-02-13T14:23:21.123Z')
            ).to.equal('13. feb 2014'); // NB zulu-time != paris-time
        });
    });

    describe('formaterDatoKortManedTid', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDatoKortManedTid(null)).to.not.exist;
            expect(Utils.formaterDatoKortManedTid(undefined)).to.not.exist;
            expect(
                Utils.formaterDatoKortManedTid('2014-02-13T14:23:21.123Z')
            ).to.equal('13. feb 2014 kl 15:23'); // NB zulu-time != paris-time
        });
    });

    describe('formaterTid', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterTid(null)).to.not.exist;
            expect(Utils.formaterTid(undefined)).to.not.exist;
            expect(Utils.formaterTid('2014-02-13T14:23:21.123Z')).to.equal(
                '15:23'
            ); // NB zulu-time != paris-time
        });
    });

    describe('datoComparator', () => {
        it('Returner 0 ved like datoer', () => {
            expect(
                Utils.datoComparator(
                    '2014-02-13T23:00:00.000Z',
                    '2014-02-13T23:00:00.000Z'
                )
            ).to.equal(0);
        });

        it('Returner > 0 hvis venstre er senere enn høyre', () => {
            expect(
                Utils.datoComparator(
                    '2014-02-16T23:00:00.000Z',
                    '2014-02-13T23:00:00.000Z'
                )
            ).to.be.above(0);
        });

        it('Returner < 0 hvis venstre er tidligere enn høyre', () => {
            expect(
                Utils.datoComparator(
                    '2014-02-13T23:00:00.000Z',
                    '2014-02-16T23:00:00.000Z'
                )
            ).to.be.below(0);
        });

        it('Fornuftig håndtering av null og undefined', () => {
            expect(
                Utils.datoComparator('2014-02-13T23:00:00.000Z', null)
            ).to.be.above(0);
            expect(
                Utils.datoComparator('2014-02-13T23:00:00.000Z', undefined)
            ).to.be.above(0);

            expect(
                Utils.datoComparator(null, '2014-02-16T23:00:00.000Z')
            ).to.be.below(0);
            expect(
                Utils.datoComparator(undefined, '2014-02-16T23:00:00.000Z')
            ).to.be.below(0);
        });
    });

    describe('storeForbokstaver', () => {
        it('Formatterer ord med stor forbokstav', () => {
            expect(Utils.storeForbokstaver('KARI')).to.equal('Kari');
            expect(Utils.storeForbokstaver('PER OLAV KNUTSON')).to.equal(
                'Per Olav Knutson'
            );
            expect(Utils.storeForbokstaver('pelle parafin')).to.equal(
                'Pelle Parafin'
            );
            expect(Utils.storeForbokstaver(null)).to.equal(null);
            expect(Utils.storeForbokstaver(undefined)).to.equal(undefined);
        });
    });

    describe('erGyldigDatoformat', () => {
        it('12.12.2012 er gyldig', () => {
            expect(Utils.erGyldigDatoformat('12.12.2012')).to.equal(true);
        });

        it('1212.2012 er ugyldig', () => {
            expect(Utils.erGyldigDatoformat('1212.2012')).to.equal(false);
        });

        it('moment-objecter er ikke gyldige', () => {
            expect(Utils.erGyldigDatoformat(moment())).to.equal(false);
        });

        it('null/undefined ikke gyldig', () => {
            expect(Utils.erGyldigDatoformat(undefined)).to.equal(false);
            expect(Utils.erGyldigDatoformat(null)).to.equal(false);
        });
    });
});
