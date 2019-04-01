const {
    aktivitetsplanOversiktSide,
} = require('../pages/sider');
const { getRelativeDate, toDateTimePrettyPrint } = require('../date-utils');
const { StillingsAktivitet } = require('../data/aktivitet-data');
const { AktivitetTilstand } = require('../data/aktivitet-tilstand');

const fraDato = getRelativeDate(0),
    tilDato = getRelativeDate(1),
    forventetTittel = 'Stillingstittel ' + toDateTimePrettyPrint(new Date());
let aktivitetData = new StillingsAktivitet(forventetTittel, fraDato, tilDato);

module.exports = {
    tags: ['stilling'],

    before: function(browser) {
        browser.useXpath();
    },

    'Bruker - naviger til side': function(browser) {
        browser.url(browser.globals.SBSUrl);
    },

    'Bruker - Legg til aktivitet - Stilling': function(browser) {
        aktivitetData =
            aktivitetsplanOversiktSide(browser)
                .leggTilOgValiderAktivitet(aktivitetData);
    },


    'Bruker - Legg til etikettstatus - Soknaden er sendt': function(browser) {
        aktivitetData.tilstand = AktivitetTilstand.SOKNADSENDT;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                aktivitetData.kolonne,
                aktivitetData.aktivitetURL
            )
            .setTilstand(aktivitetData.tilstand)
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetData);

    },

};
