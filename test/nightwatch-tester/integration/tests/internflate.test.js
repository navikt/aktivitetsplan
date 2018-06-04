'use strict';
import { aktivitetsplanOversiktSide } from '../pages/sider';
import { getRelativeDate, toDateTimePrettyPrint } from '../date-utils';
import {
    MoteMedNavAktivitet,
    SokeJobberAktivitet,
    MedisinskBehandlingAktivitet,
} from '../data/aktivitet-data';
import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

const fraDato = getRelativeDate(3),
    tilDato = getRelativeDate(5),
    forventetTittel = 'Møte ' + toDateTimePrettyPrint(new Date());
let aktivitetDataMote = new MoteMedNavAktivitet(
    forventetTittel,
    fraDato,
    '10:00',
    '1:00',
    'Telefonmøte',
    'Møtested',
    'Forberedelser'
);
let aktivitetSokeJobber = new SokeJobberAktivitet(
    fraDato,
    tilDato,
    2,
    'Skal følges opp',
    'Beskrivelse'
);
let aktivitetMedisinskBehandling = new MedisinskBehandlingAktivitet(
    forventetTittel,
    'Oslo',
    fraDato,
    tilDato,
    'Mål',
    'Beskrivelse',
    'Oppfølging'
);

module.exports = {
    tags: ['intern'],

    before: function(browser) {
        browser.useXpath();
    },

    'Veileder - naviger til side': function(browser) {
        browser.url(browser.globals.loginUrl);
    },

    'Veileder - Legg til aktivitet - Mote med nav': function(browser) {
        aktivitetDataMote = aktivitetsplanOversiktSide(
            browser
        ).leggTilOgValiderAktivitet(aktivitetDataMote);
    },

    'Veileder - Oppdatere livslopsstatus - Planlegger': function(browser) {
        aktivitetDataMote.kolonne = AktivitetStatus.GJENNOMFORES;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(
                AktivitetStatus.PLANLEGGER,
                aktivitetDataMote.aktivitetURL
            )
            .setStatus(aktivitetDataMote.kolonne)
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetDataMote);
    },

    'Veileder - Legg til aktivitet - Avtale om a soke jobber': function(
        browser
    ) {
        aktivitetSokeJobber = aktivitetsplanOversiktSide(
            browser
        ).leggTilOgValiderAktivitet(aktivitetSokeJobber, false);
    },

    'Veileder - Oppdatere livslopsstatus - Fullfort': function(browser) {
        let kolonne = aktivitetSokeJobber.kolonne;
        aktivitetSokeJobber.kolonne = AktivitetStatus.FULLFORT;

        aktivitetsplanOversiktSide(browser)
            .velgAktivitetMedHref(kolonne, aktivitetSokeJobber.aktivitetURL)
            .setStatus(aktivitetSokeJobber.kolonne)
            .validerInnhold(aktivitetSokeJobber)
            .lukkVindu(aktivitetsplanOversiktSide(browser))
            .validerAktivitet(aktivitetSokeJobber);
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
