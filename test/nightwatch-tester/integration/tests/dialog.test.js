'use strict';
import {
    aktivitetsplanOversiktSide,
    dialogOversiktModal,
} from '../pages/sider';
import { dialoger } from '../data/dialoger';

module.exports = {
    tags: ['dialog'],

    before: function(browser) {
        browser.useXpath();
    },

    'Veileder - naviger til side': function(browser) {
        browser.url(browser.globals.test_settings.loginUrl);
    },

    'Veileder - Lag ny dialog': function(browser) {
        const dialog = dialoger[0];

        aktivitetsplanOversiktSide(browser)
            .klikkDialog(dialogOversiktModal(browser))
            .leggTilDialog(dialog);
    },

    'Veileder - Lag ny dialog - Venter pa svar fra NAV': function(browser) {
        const dialog = dialoger[1];

        dialogOversiktModal(browser).leggTilDialog(dialog);
    },

    'Veileder - Lag ny dialog - Venter pa svar fra bruker': function(browser) {
        const dialog = dialoger[2];

        dialogOversiktModal(browser).leggTilDialog(dialog);
    },

    'Veileder - Lag ny dialog - Venter pa svar fra bruker og NAV': function(
        browser
    ) {
        const dialog = dialoger[3];

        dialogOversiktModal(browser).leggTilDialog(dialog);
    },

    'Veileder - Endre dialog - Fjerne merkelapper': function(browser) {
        const dialog = dialoger[3];
        dialog.venterPaBruker = false;
        dialog.venterPaNav = false;

        dialogOversiktModal(browser)
            .trykkPaDialog(0)
            .endreEtiketter(true, true)
            .lukk()
            .validerDialogPaIndeks(0, dialog);
    },

    'Veileder - Endre dialog - Skriv en ny melding': function(browser) {
        const dialog = dialoger[4];

        dialogOversiktModal(browser)
            .leggTilDialog(dialog)
            .trykkPaDialog(0)
            .skrivNyMeldingIDialog((dialog.tekst = 'ny tekst'))
            .lukk()
            .validerDialogPaIndeks(0, dialog);

        browser.end();
    },
};
