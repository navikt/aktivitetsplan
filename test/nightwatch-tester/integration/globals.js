const driver = require('../selenium/driver');
const mock = require('../mock');

module.exports = {
    before: function(done) {
        mock.startMock();
        driver.start();
        setTimeout(function() {
            done();
        }, 2000);
    },

    after: function(done) {
        mock.stopMock();
        driver.stop();
        setTimeout(function() {
            done();
        }, 200);
    },
};
