module.exports = {
    validerInnhold(aktivitet) {
        this.validerFellesInnhold(aktivitet);

        this.getValue(this.elements.inputLenke.selector, lenke => {
            this.assert.equal(lenke.value, aktivitet.lenke);
        });
        this.getValue(this.elements.inputBeskrivelse.selector, beskrivelse => {
            this.assert.equal(beskrivelse.value, aktivitet.beskrivelse);
        });
        this.getValue(
            this.section.egenaktivitet.elements.inputHensikt.selector,
            hensikt => {
                this.assert.equal(hensikt.value, aktivitet.arbeidssted);
            }
        );
        this.getValue(
            this.section.egenaktivitet.elements.inputHuskeliste.selector,
            huskeliste => {
                this.assert.equal(huskeliste.value, aktivitet.arbeidsgiver);
            }
        );

        return this;
    },

    oppgiObligatoriskeVerdierEgen(tittel, tilDato, fraDato) {
        this.oppgiTittel(tittel);
        this.oppgiTilDato(tilDato);
        this.oppgiFraDato(fraDato);

        return this;
    }
};
