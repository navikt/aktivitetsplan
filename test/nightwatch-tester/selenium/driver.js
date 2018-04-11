exports.path =
    process.platform === 'win32'
        ? 'test/nightwatch-tester/selenium/chromedriver.exe'
        : process.platform === 'darwin'
          ? 'test/nightwatch-tester/selenium/chromedriver_mac64'
          : 'test/nightwatch-tester/selenium/chromedriver';

exports.version = '2.35';

exports.start = function(args) {
    exports.defaultInstance = require('child_process').execFile(
        exports.path,
        args,
        function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        }
    );
    return exports.defaultInstance;
};
exports.stop = function() {
    if (exports.defaultInstance !== null) {
        exports.defaultInstance.kill();
    }
};
