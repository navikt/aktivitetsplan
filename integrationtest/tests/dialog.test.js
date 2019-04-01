const {
    aktivitetsplanOversiktSide,
    dialogOversiktModal,
} = require('../pages/sider');
const { dialoger } = require('../data/dialoger');
let SBSbruker;

module.exports = {
    tags: ['dialog'],

    before: function(browser) {
        browser.useXpath();
        SBSbruker = browser.globals.testbrukere.SBS;
    },

    'Veileder - naviger til side': function(browser) {
        browser.url(browser.globals.FSSUrl + SBSbruker.brukerNavn);
    },

    'Veileder - Lag ny dialog': function(browser) {
        const dialog = dialoger[0];

        aktivitetsplanOversiktSide(browser)
            .klikkDialog(dialogOversiktModal(browser))
            .leggTilDialog(dialog);
    },
    'Veileder - Skriv en ny melding': function(browser) {
        const dialog = dialoger[1];

        dialogOversiktModal(browser)
            .leggTilDialog(dialog)
            .trykkPaDialog(0)
            .skrivNyMeldingIDialog((dialog.tekst = 'ny tekst'))
            .lukk()
            .validerDialogPaIndeks(0, dialog);

        browser.end();
    },
};
