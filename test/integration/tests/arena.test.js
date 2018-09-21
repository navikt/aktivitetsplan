'use strict';
import { aktivitetsplanOversiktSide } from '../pages/sider';
import arenaAktiviteter from '../../../example/mocks/arena';
import { ArenaAktivitet } from '../data/aktivitet-data';
import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

module.exports = {
    tags: ['arena'],

    before: function(browser) {
        browser.useXpath();
    },

    'Veileder - naviger til side': function(browser) {
        browser.url(browser.globals.loginUrl);
    },

    'Veileder - Valider arenaaktivitet': function(browser) {
        const arena1 = arenaAktiviteter[0];
        const arenaAktivitet = new ArenaAktivitet(
            arena1.tittel,
            arena1.fraDato,
            arena1.tilDato,
            arena1.beskrivelse,
            AktivitetStatus[arena1.status],
            arena1.avtalt,
            arena1.arrangoer,
            arena1.antallDagerPerUke,
            arena1.deltakelseProsent
        );
        arenaAktivitet.tilstand = arena1.avtalt
            ? AktivitetTilstand.AVTALTMEDNAV
            : AktivitetTilstand.INGEN;
        arenaAktivitet.aktivitetURL = `${browser.globals
            .loginUrl}/aktivitet/vis/${arena1.id}`;

        aktivitetsplanOversiktSide(browser)
            .validerAktivitet(arenaAktivitet)
            .velgAktivitetMedHref(
                arenaAktivitet.kolonne,
                arenaAktivitet.aktivitetURL
            )
            .validerInnhold(arenaAktivitet);

        browser.end();
    },
};
