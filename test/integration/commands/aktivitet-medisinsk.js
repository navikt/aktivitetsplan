'use strict';
module.exports = {
    oppgiAlleVerdierMedisinsk(aktivitet) {
        this.oppgiType(aktivitet.behandlingsType);
        this.oppgiBehandlingssted(aktivitet.behandlingsSted);
        this.oppgiFraDato(aktivitet.fraDatoMedPunktum);
        this.oppgiTilDato(aktivitet.tilDatoMedPunktum);
        this.oppgiMal(aktivitet.mal);
        this.oppgiBeskrivelse(aktivitet.beskrivelse);
        this.oppgiBehandlingOppfolging(aktivitet.oppfolgingFraNav);
        return this;
    },

    oppgiType(type) {
        this.setValue(
            this.section.medisinskBehandling.elements.txtType.selector,
            type
        );
    },

    oppgiBehandlingssted(sted) {
        this.setValue(
            this.section.medisinskBehandling.elements.txtBehandlingsSted
                .selector,
            sted
        );
    },

    oppgiMal(mal) {
        this.setValue(
            this.section.medisinskBehandling.elements.txtMal.selector,
            mal
        );
    },

    oppgiBehandlingOppfolging(oppfolging) {
        this.setValue(
            this.section.medisinskBehandling.elements.txtOppfolging.selector,
            oppfolging
        );
    },
};
