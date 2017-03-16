/* eslint-env mocha, browser */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonchai from 'sinon-chai';
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

            expect(spy).to.be.called; // eslint-disable-line  no-unused-expressions
        });

        it('Skal kunne deffinere egen threshold', () => {
            const spy = sinon.spy();
            const throttledFn = Utils.throttle(spy, 500);
            throttledFn();

            expect(spy).to.be.called; // eslint-disable-line  no-unused-expressions
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
});
