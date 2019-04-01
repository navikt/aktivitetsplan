const {
    aktivitetsplanOversiktSide,
    dialogOversiktModal,
} = require('../pages/sider');

let env, path;
module.exports = {
    tags: ['browserstack'],

    before: function(browser) {
        const capabilities = browser.options.desiredCapabilities;
        path = browser.options.screenshotsPath;
        env = `${capabilities.device !== undefined
            ? capabilities.device
            : capabilities.os}_${capabilities.browser}`;

        browser.useXpath();
    },

    'Naviger til side': function(browser) {
        const screenshots = `${path}/AktivitetsplanOversikt_${env}.png`;
        aktivitetsplanOversiktSide(browser).navigate().ventPaSideLast();

        browser.saveScreenshot(screenshots);
    },

    'Åpne dialog og trykk på første': function(browser) {
        const screenshotsListe = `${path}/Dialogliste_${env}.png`;
        const screenshotsDialog = `${path}/Dialog_${env}.png`;
        const oversikt = aktivitetsplanOversiktSide(browser);

        const dialogOversikt = oversikt.klikkDialog(
            dialogOversiktModal(browser)
        );
        browser.saveScreenshot(screenshotsListe);
        dialogOversikt.trykkPaDialog(0);

        browser.saveScreenshot(screenshotsDialog);
        browser.end();
    },
};
