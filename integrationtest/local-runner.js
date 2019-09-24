const createTestCafe = require('testcafe');
let testcafe = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();

        return runner
            .startApp('cross-env OPEN_BROWSER=false PORT=4502 npm start', 20000)
            .src(['integrationtest/browser.test.js'])
            .browsers(['chrome:headless'])
            .screenshots('./integrationtest/screenshots/', true, '${BROWSER}_${TEST}.png')
            .run();
    })
    .then(failedCount => {
        console.log('Tests failed: ' + failedCount);
        testcafe.close();
    });
