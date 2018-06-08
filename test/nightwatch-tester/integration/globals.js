const driver = require('../selenium/driver');
const mock = require('../mock');
import { getNetworkIp } from './getNetworkIp';

module.exports = {
    default: {
        isLocal: true,
    },

    beforeEach: function(browser, done) {
        if (!this.isLocal) {
            getNetworkIp()
                .then(ip => {
                    browser.globals.baseUrl = `http://${ip}:8080`;
                    browser.globals.loginUrl = `${browser.globals
                        .baseUrl}/aktivitetsplanfelles/${browser.globals.fnr}`;
                    done();
                })
                .catch(error => {
                    done(error);
                });
        } else done();
    },

    before: function(done) {
        if (this.isLocal) {
            mock.startMock();
            driver.start();
            setTimeout(function() {
                done();
            }, 20000);
        } else done();
    },

    after: function(done) {
        if (this.isLocal) {
            mock.stopMock();
            driver.stop();
        }

        setTimeout(function() {
            done();
        }, 200);
    },
};
