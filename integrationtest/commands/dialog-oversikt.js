const { getXPathWithIndex } = require('../utils');

module.exports = {
    leggTilDialog(dialog) {
        const dialogVisning = this.api.page.dialogvisning();
        this.click(this.elements.btnNyDialog.selector);
        dialogVisning.leggTilMelding(dialog).lukk();

        this.validerDialogPaIndeks(0, dialog);
        return this;
    },

    trykkPaDialog(indeks) {
        const selektor = this.elements.radDialog.selector;
        const timeout = this.api.globals.timeout;
        const xPath = getXPathWithIndex(selektor, indeks);
        const nesteSide = this.api.page.dialogvisning();
        this.assert.elementPresent(xPath, 'Fant dialog på indeks: ' + indeks);
        this.click(xPath).waitForElementVisible(
            nesteSide.elements.side.selector,
            timeout
        );

        return nesteSide;
    },

    validerDialogPaIndeks(indeks, dialog) {
        const selektor = this.elements.radDialog.selector;
        const xPathDialog = getXPathWithIndex(selektor, indeks);

        this.validerDialogTekster(xPathDialog, dialog.tema, dialog.tekst);
        this.validerEtiketter(
            xPathDialog,
            dialog.venterPaNav,
            dialog.venterPaBruker
        );
    },

    validerDialogTekster(xPathDialog, tema, tekst) {
        const dialogTema = this.dialogTema(xPathDialog);
        const dialogTekst = this.dialogTekst(xPathDialog);

        this.api.validerTekst(
            dialogTema,
            tema,
            'Validerer at dialogtema har riktig verdi i dialogliste'
        );

        this.api.validerTekst(
            dialogTekst,
            tekst,
            'Validerer at dialogtekst har riktig verdi i dialogliste'
        );
    },

    validerEtiketter(xPathDialog, venterPaNav, venterPaBruker) {
        const timeout = this.api.globals.timeout * 2;
        const merkelappNav = this.etikettVenterPaNav(xPathDialog);
        const merkelappBruker = this.etikettVenterPaBruker(xPathDialog);

        if (venterPaNav) {
            this.waitForElementPresent(merkelappNav, timeout).assert.visible(
                merkelappNav,
                'Merkelapp: Venter på svar fra nav finnes'
            );
        } else {
            this.waitForElementNotPresent(
                merkelappNav,
                timeout
            ).assert.elementNotPresent(merkelappNav);
        }

        if (venterPaBruker) {
            this.waitForElementPresent(merkelappBruker, timeout).assert.visible(
                merkelappBruker,
                'Merkelapp: Venter på svar fra bruker finnes'
            );
        } else {
            this.waitForElementNotPresent(
                merkelappBruker,
                timeout
            ).assert.elementNotPresent(merkelappBruker);
        }
    },
};
