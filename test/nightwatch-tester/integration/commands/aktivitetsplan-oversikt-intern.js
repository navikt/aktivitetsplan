module.exports = {
    validerPrivatModus() {
        this.validerStatusLeggTilAktivitet(true)
            .validerAlertTekst('Brukeren er ikke under oppfølging')
            .validerAntallAktiviteter(0)
            .validerAntallTrykkbareNavigasjonsLenker(0);
    },

    validerAlertTekst(tekst) {
        this.getText(
            this.section.InternSection.elements.alertText.selector,
            callback => {
                this.assert.equal(callback.value, tekst);
            }
        );
        return this;
    },

    validerAntallAktiviteter(forventetAntall) {
        this.api.elements(
            'xpath',
            this.elements.aktivitetsKort.selector,
            element => {
                this.assert.equal(
                    element.value.length,
                    forventetAntall,
                    'Validerer antall aktiviteter'
                );
            }
        );
        return this;
    },

    validerAntallTrykkbareNavigasjonsLenker(forventetAntall) {
        this.api.elements(
            'xpath',
            this.section.InternSection.elements.lenkeNavigasjonsLenke.selector,
            element => {
                this.assert.equal(
                    element.value.length,
                    forventetAntall,
                    'Validerer antall trykkbare navigasjonslenker'
                );
            }
        );
        return this;
    },

    validerStatusLeggTilAktivitet(disabled) {
        const disabledAtt = 'disabled';
        const forventetStatus = disabled ? 'true' : 'null';
        const msgTekst = `Legg til aktivitet knapp skal være disabled: ${disabled}`;
        this.waitForElementPresent(
            this.elements.btnLeggTilAktivitet.selector,
            10000
        );
        this.getAttribute(
            this.elements.btnLeggTilAktivitet.selector,
            disabledAtt,
            callback => {
                this.assert.equal(
                    String(callback.value),
                    forventetStatus,
                    msgTekst
                );
            }
        );
        return this;
    },
};
