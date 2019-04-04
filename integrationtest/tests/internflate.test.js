const { aktivitetsplanOversiktSide } = require('../pages/sider');
const { getRelativeDate, toDateTimePrettyPrint } = require('../date-utils');
const {
    MedisinskBehandlingAktivitet,
} = require('../data/aktivitet-data');
const { AktivitetTilstand } = require('../data/aktivitet-tilstand');

const fraDato = getRelativeDate(8),
    tilDato = getRelativeDate(10),
    forventetTittel = 'Møte ' + toDateTimePrettyPrint(new Date());

let aktivitetMedisinskBehandling = new MedisinskBehandlingAktivitet(
    forventetTittel,
    'Oslo',
    fraDato,
    tilDato,
    'Mål',
    'Beskrivelse',
    'Oppfølging'
);
let SBSbruker;
module.exports = {
    tags: ['intern'],

    before: function(browser) {
        browser.useXpath();
        SBSbruker = browser.globals.testbrukere.SBS;
    },

    'Veileder - naviger til side': function(browser) {
        browser.url(browser.globals.FSSUrl + SBSbruker.brukerNavn);
    },

    'Veileder - Legg til aktivitet - Medisinsk behandling': function(browser) {
        aktivitetMedisinskBehandling = aktivitetsplanOversiktSide(
            browser
        ).leggTilOgValiderAktivitet(aktivitetMedisinskBehandling, false);
    },

    'Veileder - Oppdater aktivitet - Avtalt med nav': function(browser) {
        aktivitetMedisinskBehandling.tilstand = AktivitetTilstand.AVTALTMEDNAV;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                aktivitetMedisinskBehandling.kolonne,
                aktivitetMedisinskBehandling.aktivitetURL
            )
            .markerAvtaltMedNav()
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetMedisinskBehandling);

        browser.end();
    },
};
