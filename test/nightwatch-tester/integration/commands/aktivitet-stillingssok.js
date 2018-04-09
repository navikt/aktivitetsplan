module.exports = {
    oppgiObligatoriskeVerdierStilling(tittel, tilDato) {
        this.oppgiTittel(tittel);
        this.oppgiTilDato(tilDato);
        return this;
    },

    validerInnhold(aktivitet) {
        this.validerFellesInnhold(aktivitet);

        this.getValue(this.elements.inputLenke.selector, lenke => {
            this.assert.equal(lenke.value, aktivitet.lenke);
        });
        this.getValue(this.elements.inputBeskrivelse.selector, beskrivelse => {
            this.assert.equal(beskrivelse.value, aktivitet.beskrivelse);
        });
        this.getValue(
            this.section.stilling.elements.inputArbeidssted.selector,
            arbeidssted => {
                this.assert.equal(arbeidssted.value, aktivitet.arbeidssted);
            }
        );
        this.getValue(
            this.section.stilling.elements.inputArbeidsgiver.selector,
            arbeidsgiver => {
                this.assert.equal(arbeidsgiver.value, aktivitet.arbeidsgiver);
            }
        );
        this.getValue(
            this.section.stilling.elements.inputKontaktperson.selector,
            kontaktperson => {
                this.assert.equal(kontaktperson.value, aktivitet.arbeidssted);
            }
        );
        return this;
    },

    oppgiArbeidssted(arbeidssted) {
        return this.setValue(
            this.section.stilling.elements.inputArbeidssted.selector,
            arbeidssted
        );
    },

    oppgiArbeidsgiver(arbeidsgiver) {
        return this.setValue(
            this.section.stilling.elements.inputArbeidsgiver.selector,
            arbeidsgiver
        );
    },

    oppgiKontaktperson(kontaktperson) {
        return this.setValue(
            this.section.stilling.elements.inputKontaktperson.selector,
            kontaktperson
        );
    },
};
