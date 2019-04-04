const {
    aktivitetsplanOversiktSide,
} = require('../pages/sider');
const { getRelativeDate, toDateTimePrettyPrint } = require('../date-utils');
const { JobbrettetAktivitet } = require('../data/aktivitet-data');
const { AktivitetStatus } = require('../data/aktivitet-status');

const fraDato = getRelativeDate(0),
    tilDato = getRelativeDate(1),
    forventetTittel = 'Egenaktivitet ' + toDateTimePrettyPrint(new Date());
let aktivitetData = new JobbrettetAktivitet(forventetTittel, fraDato, tilDato);

module.exports = {
    tags: ['egenaktivitet'],

    before: function(browser) {
        browser.useXpath();
    },

    'Bruker - naviger til side': function(browser) {
        browser.url(browser.globals.SBSUrl);
    },

    'Bruker - Legg til aktivitet med obligatoriske verdier - Egenaktivitet': function(
        browser
    ) {
        aktivitetData = aktivitetsplanOversiktSide(
            browser
        ).leggTilOgValiderAktivitet(aktivitetData);
    },

    'Bruker - Oppdatere livslopsstatus - Avbrutt': function(browser) {
        const gammelStatus = aktivitetData.kolonne;
        aktivitetData.kolonne = AktivitetStatus.AVBRUTT;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(gammelStatus, aktivitetData.aktivitetURL)
            .setStatus(aktivitetData.kolonne)
            .validerInnhold(aktivitetData)
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetData);

        browser.end();
    },
};
