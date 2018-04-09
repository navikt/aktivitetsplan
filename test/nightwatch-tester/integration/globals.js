const driver = require('../selenium/driver');

module.exports = {
    before: function(done) {
        driver.start();
        setTimeout(function() {
            done();
        }, 200);
    },

    after: function(done) {
        driver.stop();
        setTimeout(function() {
            done();
        }, 200);
    },
};
