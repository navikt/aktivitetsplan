const createTestCafe = require('testcafe');
const utils = require('./getNetworkIp');
const browsers = ['saucelabs:iPhone XS Simulator@12.0', 'saucelabs:Chrome@73.0:Windows 10', 'saucelabs:MicrosoftEdge@16.16299:Windows 10', 'saucelabs:Samsung Galaxy Tab S3 GoogleAPI Emulator@8.1'];
const pullRequest = process.env.TRAVIS_PULL_REQUEST || false;
const branch = pullRequest
    ? process.env.TRAVIS_PULL_REQUEST_BRANCH
    : process.env.TRAVIS_BRANCH || 'Local';

process.env.SAUCE_JOB = 'aktivitetsplan';
process.env.SAUCE_BUILD = branch;
process.env.SAUCE_API_HOST = 'eu-central-1.saucelabs.com';

utils.getNetworkIp().then(ip => {

    console.log("Starter testcafe");
    createTestCafe(ip, 1337, 1338).then(testcafe => {
        testcafe
            .createRunner()
            .startApp("cross-env PORT=4502 npm start", 20000)
            .src(['integrationtest/browser.test.js'])
            .browsers(browsers)
            .screenshots('./integrationtest/screenshots/', true, '${BROWSER}_${TEST}.png')
            .run()
            .then(failedCount => {
                console.log('Tests failed: ' + failedCount);
                testcafe.close();
                if(failedCount > 0) process.exit(1);
            })
            .catch(e => {
                console.log("Runner error: " + e);
                testcafe.close().then(() => process.exit(1));
            });
    })
});
