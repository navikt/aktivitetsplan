module.exports = {
    tags: ['print'],

    'Print knapp synlig': function(browser) {
        browser.url(
            browser.globals.FSSUrl +
                browser.globals.testbrukere.SBS.brukerNavn +
                '/utskrift'
        );
        browser.waitForElementVisible(
            '.printmodal-header__printknapp',
            browser.globals.timeout
        );
        browser.end();
    },
};
