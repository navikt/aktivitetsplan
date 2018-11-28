const dialogActions = require('../commands/dialog-oversikt.js');

module.exports = {
    elements: {
        side: '//div[@class="dialog-modal__innhold"]',
        btnNyDialog:
            '//button[contains(@class, "dialog-modal__ny-dialog-knapp")]',
        radDialog: '//a[contains(@class,"dialoger__dialog")]',
        txtDialogTema: '/span/p[@class="typo-element"]',
        txtDialogTekst: '/span/p[contains(@class, "dialoger__dialog-tekst")]',
        merkelappVenterPaBruker:
            '//span[contains(@class,"etikett--mabesvares")]',
        merkelappVenterPaNAV:
            '//span[contains(@class, "etikett--ikkebehandlet")]',
    },
    commands: [
        dialogActions,
        {
            dialogTema(dialog) {
                return dialog + this.elements.txtDialogTema.selector;
            },

            dialogTekst(dialog) {
                return dialog + this.elements.txtDialogTekst.selector;
            },

            etikettVenterPaNav(dialog) {
                return dialog + this.elements.merkelappVenterPaNAV.selector;
            },

            etikettVenterPaBruker(dialog) {
                return dialog + this.elements.merkelappVenterPaBruker.selector;
            },
        },
    ],
};
