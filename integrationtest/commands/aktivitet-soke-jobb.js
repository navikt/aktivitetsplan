module.exports = {
    oppgiAlleVerdierSokeJobb(aktivitet) {
        this.oppgiFraDato(aktivitet.fraDatoMedPunktum);
        this.oppgiTilDato(aktivitet.tilDatoMedPunktum);
        this.oppgiAntall(aktivitet.antallSoknader);
        this.oppgiOppfolging(aktivitet.oppfolgingFraNav);
        this.oppgiBeskrivelse(aktivitet.beskrivelse);
        return this;
    },

    oppgiAntall(antall) {
        this.setValue(
            this.section.sokeJobb.elements.txtAntall.selector,
            antall
        );
    },
    oppgiOppfolging(oppfolging) {
        this.setValue(
            this.section.sokeJobb.elements.txtOppfolging.selector,
            oppfolging
        );
    },
};
