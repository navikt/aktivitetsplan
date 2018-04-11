const dialogActions = require('../commands/dialog-visning.js');

module.exports = {
    elements: {
        side: '//form[@class="ny-henvendelse-form"]',
        txtTema: '//input[@id="overskrift"]',
        txtTekst: '//textarea[@id="tekst"]',
        btnSend:
            '//button[@type="submit" and not(@disabled)]/span[text()="Send"]/parent::button',
        ikonBruker: '//i[contains(@class, "ikon--bruker-noytral")]',
        ikonSuksess:
            '//div[contains(@class, "alertstripe--suksess")]/span[@class="alertstripe__ikon" and @aria-label="suksess"]',
        btnTilbakeTilListe: '//button[@aria-label="Tilbake til dialoglisten"]',
        sectionHendvendelser: '//div[@class="dialog-henvendelser"]',
        snakkebobleVenstre: '//div[contains(@class, "snakkeboble--venstre")]',
        snakkebobleHoyre: '//div[contains(@class, "snakkeboble--hoyre")]',
        txtSnakkeboble: '//div[@class="snakkeboble-panel__tekst"]',
        cbVenterPaNAV:
            '//div[contains(@class, "endre-dialog__sjekkboks")]//span[text()="Venter på svar fra NAV"]/parent::label',
        cbVenterPaBruker:
            '//div[contains(@class, "endre-dialog__sjekkboks")]//span[text()="Venter på svar fra bruker"]/parent::label',
    },
    commands: [
        dialogActions,
        {
            snakkebobleVenstre() {
                return (
                    this.elements.sectionHendvendelser.selector +
                    this.elements.snakkebobleVenstre.selector
                );
            },
            snakkebobleHoyre() {
                return (
                    this.elements.sectionHendvendelser.selector +
                    this.elements.snakkebobleHoyre.selector
                );
            },
            alleSnakkebobler() {
                return (
                    this.elements.snakkebobleVenstre.selector +
                    '|' +
                    this.elements.snakkebobleHoyre.selector
                );
            },
            snakkebobleTekst(snakkebobleSelektor) {
                return (
                    snakkebobleSelektor + this.elements.txtSnakkeboble.selector
                );
            },
        },
    ],
};
