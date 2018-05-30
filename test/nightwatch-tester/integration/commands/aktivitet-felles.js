import { AktivitetsType } from '../data/aktivitet-type';

module.exports = {
    oppgiObligatoriskeVerdier(aktivitet) {
        if (aktivitet.type === AktivitetsType.STILLING)
            this.oppgiObligatoriskeVerdierStilling(
                aktivitet.tittel,
                aktivitet.tilDatoMedPunktum
            );
        else if (aktivitet.type === AktivitetsType.EGENAKTIVITET)
            this.oppgiObligatoriskeVerdierEgen(
                aktivitet.tittel,
                aktivitet.tilDatoMedPunktum,
                aktivitet.fraDatoMedPunktum
            );
        else if (aktivitet.type === AktivitetsType.MOTE)
            this.oppgiObligatoriskeVerdierMote(aktivitet);
        else
            this.assert.fail(
                `Oppgi obligatoriske verdier for ${aktivitet.type} er ikke implementert`
            );
        return this;
    },

    oppgiAlleVerdier(aktivitet) {
        if (aktivitet.type === AktivitetsType.MEDISINSKBEHANDLING)
            this.oppgiAlleVerdierMedisinsk(aktivitet);
        else if (aktivitet.type === AktivitetsType.AVTALE)
            this.oppgiAlleVerdierSokeJobb(aktivitet);
        else
            this.assert.fail(
                `Oppgi alle verdier for ${aktivitet.type} er ikke implementert`
            );
        return this;
    },

    validerFellesInnhold(aktivitet) {
        this.getValue(this.elements.inputTittel.selector, tittel => {
            this.assert.equal(tittel.value, aktivitet.tittel);
        });

        this.getValue(this.elements.inputFraDato.selector, fraDato => {
            this.assert.equal(fraDato.value, aktivitet.fraDatoMedPunktum);
        });
        this.getValue(this.elements.inputTilDato.selector, tilDato => {
            this.assert.equal(tilDato.value, aktivitet.tilDatoMedPunktum);
        });
    },

    oppgiTittel(tittel) {
        return this.setValue(this.elements.inputTittel.selector, tittel);
    },

    oppgiFraDato(dato) {
        return this.setValue(this.elements.inputFraDato.selector, dato);
    },

    oppgiTilDato(dato) {
        this.click(this.elements.inputTilDato.selector);
        this.setValue(this.elements.inputTilDato.selector, dato);
        return this.setValue(this.elements.inputTilDato.selector, dato);
    },

    oppgiBeskrivelse(beskrivelse) {
        return this.setValue(
            this.elements.inputBeskrivelse.selector,
            beskrivelse
        );
    },

    oppgiLenke(lenke) {
        return this.setValue(this.elements.inputLenke.selector, lenke);
    },

    lagre(nesteSide) {
        const elements = this.elements;
        const timeout = this.api.globals.timeout;
        this.click(elements.btnLagre.selector)
            .waitForElementNotPresent(elements.side.selector, timeout)
            .waitForElementVisible(nesteSide.elements.side.selector, timeout);
        return nesteSide;
    },
};
