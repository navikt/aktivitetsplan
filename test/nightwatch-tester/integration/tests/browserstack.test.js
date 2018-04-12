let env, path;
module.exports = {
    tags: ['browserstack'],

    before: function(browser) {
        browser.useXpath();
        const capabilities = browser.options.desiredCapabilities;
        path = browser.options.screenshotsPath;
        env = `${capabilities.os}_${capabilities.browser}`;
    },

    'Naviger til side': function(browser) {
        const screenshots = `${path}/AktivitetsplanOversikt_${env}.png`;
        browser.url(browser.launch_url);
        browser.waitForElementPresent('html/body', 1000);
        browser.saveScreenshot(screenshots);
        browser.end();
    },
};
