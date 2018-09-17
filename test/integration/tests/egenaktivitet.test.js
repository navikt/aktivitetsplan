'use strict';
import {
    aktivitetsplanOversiktSide,
    aktivitetModal,
    aktivitetsvisningModal,
} from '../pages/sider';
import { getRelativeDate, toDateTimePrettyPrint } from '../date-utils';
import { JobbrettetAktivitet } from '../data/aktivitet-data';
import { AktivitetStatus } from '../data/aktivitet-status';

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
        browser.url(browser.globals.loginUrl);
    },

    'Bruker - Legg til aktivitet med obligatoriske verdier - Egenaktivitet': function(
        browser
    ) {
        aktivitetData = aktivitetsplanOversiktSide(
            browser
        ).leggTilOgValiderAktivitet(aktivitetData);
    },

    'Bruker - Oppdatere tekstfelter - Egenaktivitet, ikke avtalt med nav': function(
        browser
    ) {
        aktivitetData.oppgiValgfrieFelter(
            'http://google.com/',
            'hensikt',
            'beskrivelse',
            'huskeliste'
        );

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                aktivitetData.kolonne,
                aktivitetData.aktivitetURL
            )
            .trykkEndre(aktivitetModal(browser))
            .oppgiLenke(aktivitetData.lenke)
            .oppgiHensikt(aktivitetData.hensikt)
            .oppgiBeskrivelse(aktivitetData.beskrivelse)
            .oppgiHuskeliste(aktivitetData.huskeliste)
            .lagre(aktivitetsvisningModal(browser))
            .validerInnhold(aktivitetData)
            .lukkVindu(aktivitetsplanOversiktSide(browser));
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
