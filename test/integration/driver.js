exports.path =
    process.platform === 'win32'
        ? 'test/integration/chrome-driver/chromedriver.exe'
        : process.platform === 'darwin'
          ? 'test/integration/chrome-driver/chromedriver_mac64'
          : 'test/integration/chrome-driver/chromedriver';

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
