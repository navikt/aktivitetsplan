import { getXPathWithIndex } from '../utils';
module.exports = {
    leggTilMelding(dialog, oppgiTema = true) {
        this.endreEtiketter(dialog.venterPaNav, dialog.venterPaBruker);
        if (oppgiTema) this.oppgiTema(dialog.tema);
        this.skrivNyMeldingIDialog(dialog.tekst);
        this.validerSnakkeboble(dialog.tekst);
        return this;
    },

    oppgiTema(tema) {
        this.setValue(this.elements.txtTema.selector, tema);
    },

    validerSnakkeboble(tekst) {
        const bobleSelektor = this.alleSnakkebobler();
        const timeout = this.api.globals.timeout;
        const xPathBoble = getXPathWithIndex(bobleSelektor, 0);
        const tekstSelektor = this.snakkebobleTekst(xPathBoble);

        this.waitForElementVisible(bobleSelektor, timeout);
        this.validerTekst(
            tekstSelektor,
            tekst,
            'Validerer tekstverdi på snakkeboble'
        );

        return this;
    },

    skrivNyMeldingIDialog(tekst) {
        const timeout = this.api.globals.timeout;
        this.setValue(this.elements.txtTekst.selector, tekst);
        this.click(this.elements.btnSend.selector);
        this.api.pause(50); // unngå at neste linje passerer med en gang før knappen har rukket å bli disabled
        this.waitForElementVisible(this.elements.btnSend.selector, timeout);
        this.validerSnakkeboble(tekst);
        return this;
    },

    endreEtiketter(endreVenterPaNav, endreVenterPaBruker) {
        if (endreVenterPaNav) this.click(this.elements.cbVenterPaNAV.selector);
        if (endreVenterPaBruker && endreVenterPaNav) this.api.pause(500);
        if (endreVenterPaBruker)
            this.click(this.elements.cbVenterPaBruker.selector);
        return this;
    },

    lukk() {
        const timeout = this.api.globals.timeout;
        const tilbakeknapp = this.elements.btnTilbakeTilListe.selector;
        this.waitForElementPresent(tilbakeknapp, timeout);
        //For mobilskjerm
        this.isVisible(tilbakeknapp, result => {
            if (result.value) {
                this.click(tilbakeknapp);
            }
        });
        return this.api.page.dialogOversiktModal();
    },
};
