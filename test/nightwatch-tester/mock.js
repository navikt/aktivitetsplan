let exec = require('child_process').exec;
let kill = require('tree-kill');

exports.startMock = function() {
    exports.instance = exec('npm run dev:nightwatch', function(error) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
};

exports.stopMock = function() {
    if (exports.instance !== null) {
        kill(exports.instance.pid);
    }
};
