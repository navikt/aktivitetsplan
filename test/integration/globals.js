const chromedriver = require('chromedriver');
const mock = require('./mock');
import { getNetworkIp } from './getNetworkIp';
import { getFasitUsers, setBrowserCookies } from './testbruker';

module.exports = {
    asyncHookTimeout: 30000,

    default: {
        isLocal: true,
    },
    verdikjede: {
        verdikjedeTest: true,
        isLocal: true,
        fetchCookies: true,
        setCookies: true,
        testbrukere: null,
    },

    beforeEach: function(browser, done) {
        if (!this.isLocal) {
            getNetworkIp()
                .then(ip => {
                    browser.globals.baseUrl = `http://${ip}:8080`;
                    done();
                })
                .catch(error => {
                    done(error);
                });
        } else if (this.fetchCookies) {
            getFasitUsers(browser.globals.testmiljo, true)
                .then(testbrukere => {
                    setBrowserCookies(browser, testbrukere);
                    this.fetchCookies = false;
                    this.testbrukere = testbrukere;
                    browser.globals.testbrukere = testbrukere;
                })
                .then(() => done());
        } else if (this.setCookies) {
            browser.globals.testbrukere = this.testbrukere;
            setBrowserCookies(browser, this.testbrukere);
        } else done();
    },

    before: function(done) {
        if (this.isLocal) {
            chromedriver.start();
        }
        if (!this.browserstack && !this.verdikjedeTest) {
            mock.startMock();
            setTimeout(function() {
                done();
            }, 20000);
        } else done();
    },

    after: function(done) {
        if (this.isLocal) {
            chromedriver.stop();
        }
        if (!this.browserstack && !this.verdikjedeTest) {
            mock.stopMock();
        }

        setTimeout(function() {
            done();
        }, 200);
    },
};
