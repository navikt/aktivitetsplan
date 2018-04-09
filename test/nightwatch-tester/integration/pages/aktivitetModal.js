const aktivitetStillingsSok = require('../commands/aktivitet-stillingssok.js');
const aktivitetFelles = require('../commands/aktivitet-felles.js');
const aktivitetEgen = require('../commands/aktivitet-egenaktivitet.js');
const aktivitetMote = require('../commands/aktivitet-mote.js');
const aktivitetSoke = require('../commands/aktivitet-soke-jobb');
const aktivitetMedisinsk = require('../commands/aktivitet-medisinsk');

module.exports = {
    url: function() {
        return (
            this.api.globals.test_settings.baseUrl +
            '/aktivitetsplan/aktivitet/ny/stilling'
        );
    },
    commands: [
        aktivitetFelles,
        aktivitetStillingsSok,
        aktivitetEgen,
        aktivitetMote,
        aktivitetSoke,
        aktivitetMedisinsk,
    ],
    elements: {
        side: '//div[@class="skjema-innlogget aktivitetskjema"]',
        inputTittel: '//input[@id="tittel"]',
        inputFraDato: '//input[@id="fraDato"]',
        inputTilDato: '//input[@id="tilDato"]',
        inputLenke: '//input[@id="lenke"]',
        inputBeskrivelse: '//textarea[@id="beskrivelse"]',
        btnLagre: '//button[@type="submit"]',
    },
    sections: {
        stilling: {
            selector: '//div[@class="skjema-innlogget aktivitetskjema"]',
            commands: [aktivitetStillingsSok],
            elements: {
                inputArbeidssted: '//input[@id="arbeidssted"]',
                inputArbeidsgiver: '//input[@id="arbeidsgiver"]',
                inputKontaktperson: '//input[@id="kontaktperson"]',
            },
        },
        egenaktivitet: {
            selector: '//div[@class="skjema-innlogget aktivitetskjema"]',
            commands: [aktivitetEgen],
            elements: {
                inputHensikt: '//input[@id="hensikt"]',
                inputHuskeliste: '//input[@id="oppfolging"]',
            },
        },
        moteMedNav: {
            selector: '//div[@class="skjema-innlogget aktivitetskjema"]',
            commands: [aktivitetMote],
            elements: {
                inputDato: '//input[@id="dato"]',
                cbKlokkeslett: '//select[@name="klokkeslett"]',
                cbVarighet: '//select[@name="varighet"]',
                cbMoteForm: '//select[@name="kanal"]',
                inputMotested: '//input[@id="adresse"]',
                inputForberedelser: '//textarea[@id="forberedelser"]',
            },
        },
        sokeJobb: {
            selector: '//div[@class="skjema-innlogget aktivitetskjema"]',
            commands: [aktivitetSoke],
            elements: {
                txtAntall: '//input[@id="antallStillingerSokes"]',
                txtOppfolging: '//textarea[@id="avtaleOppfolging"]',
            },
        },

        medisinskBehandling: {
            selector: '//div[@class="skjema-innlogget aktivitetskjema"]',
            commands: [aktivitetMedisinsk],
            elements: {
                txtType: '//input[@id="behandlingType"]',
                txtBehandlingsSted: '//input[@id="behandlingSted"]',
                txtMal: '//input[@id="effekt"]',
                txtOppfolging: '//input[@id="behandlingOppfolging"]',
            },
        },
    },
};
