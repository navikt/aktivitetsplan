module.exports = {
    oppgiObligatoriskeVerdierMote(aktivitetData) {
        this.oppgiTittel(aktivitetData.tittel);
        this.oppgiDato(aktivitetData.fraDatoMedPunktum);
        this.oppgiKlokkeslett(aktivitetData.klokkeslett);
        this.oppgiVarighet(aktivitetData.varighet);
        this.oppgiMoteform(aktivitetData.moteform);
        this.oppgiMotested(aktivitetData.motested);
        this.oppgiForberedelser(aktivitetData.forberedelser);
        return this;
    },

    oppgiDato(dato) {
        this.setValue(
            this.section.moteMedNav.elements.inputDato.selector,
            dato
        );
    },

    oppgiKlokkeslett(klokkeslett) {
        this.setValue(
            this.section.moteMedNav.elements.cbKlokkeslett.selector,
            klokkeslett
        );
    },

    oppgiVarighet(varighet) {
        this.setValue(
            this.section.moteMedNav.elements.cbVarighet.selector,
            varighet
        );
    },

    oppgiMoteform(moteform) {
        this.setValue(
            this.section.moteMedNav.elements.cbMoteForm.selector,
            moteform
        );
    },

    oppgiMotested(motested) {
        this.setValue(
            this.section.moteMedNav.elements.inputMotested.selector,
            motested
        );
    },

    oppgiForberedelser(forberedelser) {
        this.setValue(
            this.section.moteMedNav.elements.inputForberedelser.selector,
            forberedelser
        );
    },
};
