const { aktivitetsplanOversiktSide } = require('../pages/sider');
const arenaAktiviteter = require('../../src/mocks/arena');
const { ArenaAktivitet } = require('../data/aktivitet-data');
const { AktivitetTilstand } = require('../data/aktivitet-tilstand');
const { AktivitetStatus } = require('../data/aktivitet-status');

let SBSbruker;

module.exports = {
    tags: ['arena'],

    before: function(browser) {
        browser.useXpath();
        SBSbruker = browser.globals.testbrukere.SBS;
    },

    'Veileder - naviger til side': function(browser) {
        browser.url(browser.globals.FSSUrl + SBSbruker.brukerNavn);
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
            .FSSUrl}${SBSbruker.brukerNavn}/aktivitet/vis/${arena1.id}`;

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
