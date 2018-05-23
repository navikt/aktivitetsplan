const driver = require('../selenium/driver');
const mock = require('../mock');

module.exports = {
    'default' : {
        isLocal : true,
    },

    before: function(done) {
        mock.startMock();

        if(this.isLocal) driver.start();

        setTimeout(function() {
            done();
        }, 5000);
    },

    after: function(done) {
        mock.stopMock();

        if(this.isLocal) driver.stop();

        setTimeout(function() {
            done();
        }, 5000);
    },
};
