'use strict';
import {
    aktivitetsplanOversiktSide,
    aktivitetModal,
    aktivitetsvisningModal,
} from '../pages/sider';
import { getRelativeDate, toDateTimePrettyPrint } from '../date-utils';
import { StillingsAktivitet } from '../data/aktivitet-data';
import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

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
        browser.url(browser.globals.test_settings.loginUrl);
    },

    'Bruker - Legg til aktivitet med obligatoriske verdier - Stilling': function(
        browser
    ) {
        aktivitetData = aktivitetsplanOversiktSide(
            browser
        ).leggTilOgValiderAktivitet(aktivitetData);
    },

    'Bruker - Oppdatere tekstfelter - Ikke avtalt med nav': function(browser) {
        aktivitetData.oppgiValgfrieFelter(
            'http://google.com/',
            'beskrivelse',
            'arbeidssted',
            'Arbeidsgiver',
            'Kontaktperson'
        );

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                aktivitetData.kolonne,
                aktivitetData.aktivitetURL
            )
            .trykkEndre(aktivitetModal(browser))
            .oppgiLenke(aktivitetData.lenke)
            .oppgiBeskrivelse(aktivitetData.beskrivelse)
            .oppgiArbeidssted(aktivitetData.arbeidssted)
            .oppgiArbeidsgiver(aktivitetData.arbeidsgiver)
            .oppgiKontaktperson(aktivitetData.kontaktperson)
            .lagre(aktivitetsvisningModal(browser))
            .validerInnhold(aktivitetData)
            .lukkVindu(aktivitetsplanOversiktSide(browser));
    },

    'Bruker - Oppdatere livslopsstatus - Gjennomforer': function(browser) {
        aktivitetData.kolonne = AktivitetStatus.GJENNOMFORER;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                AktivitetStatus.PLANLEGGER,
                aktivitetData.aktivitetURL
            )
            .setStatus(aktivitetData.kolonne)
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetData);
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

    'Bruker - Oppdatere etikettstatus - Innkalt til intervju': function(
        browser
    ) {
        aktivitetData.tilstand = AktivitetTilstand.INNKALT;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                aktivitetData.kolonne,
                aktivitetData.aktivitetURL
            )
            .setTilstand(aktivitetData.tilstand)
            .validerInnhold(aktivitetData)
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetData);
    },

    'Bruker - Oppdatere livslopsstatus - Fullfort': function(browser) {
        aktivitetData.kolonne = AktivitetStatus.FULLFORT;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                AktivitetStatus.GJENNOMFORER,
                aktivitetData.aktivitetURL
            )
            .setStatus(aktivitetData.kolonne)
            .validerInnhold(aktivitetData)
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetData);

        browser.end();
    },
};
