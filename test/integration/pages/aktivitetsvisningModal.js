import { AktivitetTilstand } from '../data/aktivitet-tilstand';
import { AktivitetStatus } from '../data/aktivitet-status';
const aktivitetsvisning = require('../commands/aktivitetsvisning.js');

module.exports = {
    url: function() {
        return this.api.globals.baseUrl + '/aktivitetsplan/aktivitet/vis';
    },

    elements: {
        side: '//section[@class="aktivitetsvisning"]',
        btnLukk: '//button[contains(@class, "lukknapp")]',
        txtSideTittel: '//h1[@id="modal-aktivitetsvisning-header"]',

        lenke: '//*[@data-testid="aktivitetdetaljer.lenke-label"]/a',
        txtFraDato:
            '//*[contains(@data-testid, "aktivitetdetaljer.fra-dato-tekst")]/p',
        txtTilDato:
            '//*[contains(@data-testid, "aktivitetdetaljer.til-dato-tekst")]/p',

        // STILLING
        txtArbeidsgiver:
            '//*[@data-testid="aktivitetdetaljer.arbeidsgiver-label"]/p',
        txtArbeidssted:
            '//*[@data-testid="aktivitetdetaljer.arbeidssted-label"]/p',
        txtKontaktperson:
            '//*[@data-testid="aktivitetdetaljer.kontaktperson-label"]/p',
        txtBeskrivelse:
            '//*[@data-testid="aktivitetvisning.beskrivelse-label"]/div[@class="detaljfelt__tekst"]//span',

        // ARENA TILTAK
        txtArrangoer: '//*[@data-testid="aktivitetdetaljer.aarrangor-label"]/p',
        txtDeltakelseProsent:
            '//*[@data-testid="aktivitetdetaljer.deltakelsesprosent-label"]/p',
        txtDagerPerUke:
            '//*[@data-testid="aktivitetdetaljer.antall-dager-per-uke-label"]/p',

        // MØTE
        txtDato: '//*[@data-testid="aktivitetdetaljer.dato"]/p',
        txtKlokkeslett: '//*[@data-testid="aktivitetdetaljer.klokkeslett"]/p',
        txtKanal: '//*[@data-testid="aktivitetdetaljer.kanal"]/p',
        txtVarighet: '//*[@data-testid="aktivitetdetaljer.varighet"]/p',
        txtAdresse: '//*[@data-testid="aktivitetdetaljer.adresse"]/p',
        txtBakgrunn:
            '//*[@data-testid="aktivitetdetaljer.bakgrunn"]/div[@class="detaljfelt__tekst"]//span',
        txtForberedelser:
            '//*[@data-testid="aktivitetdetaljer.forberedelser"]/div[@class="detaljfelt__tekst"]//span',

        // EGENAKTIVITET
        txtHuskeliste:
            '//*[@data-testid="aktivitetdetaljer.oppfolging-label"]/p',
        txtHensikt: '//*[@data-testid="aktivitetdetaljer.hensikt-label"]/p',

        // AVTALE OM Å SØKE
        txtAntall: '//*[@data-testid="aktivitetdetaljer.antall-label"]/p',
        txtOppfolging:
            '//*[@data-testid="aktivitetdetaljer.avtale-oppfolging-label"]/div[@class="detaljfelt__tekst"]//span',

        // MEDISINSK
        txtBehandlingType:
            '//*[@data-testid="aktivitetdetaljer.behandling-type-label"]/p',
        txtBehandlingSted:
            '//*[@data-testid="aktivitetdetaljer.behandling-sted-label"]/p',
        txtBehandlingOppfolgning:
            '//*[@data-testid="aktivitetdetaljer.behandling-oppfolging-label"]/p',

        btnEndre: '//a[contains(@class, "lenkeknapp lenkeknapp--hoved")]',
        rdioAvtaltMedNav: '//div[@class="avtalt-container__radio"]/div/label',
        btnBekreftAvtaltMedNav:
            '//div[contains(@class, "avtalt-container")]/button[@type="submit"]',
        txtAvtaltMedNav:
            '//div[contains(@class, "avtalt-container__vis-avtalt")]/h2/span',
        btnSlett: '//div[@class="modal-footer"]/button[@type="submit"]',
        wndBekreftSletting: '//div[@class="bekreft-slett-container"]',
        btnBekreftSletting: '//button[contains(@class, "knapp--fare")]',
        btnDialog: '//button[@value="dialog"]',
    },

    commands: [aktivitetsvisning],
    sections: {
        statusSection: {
            selector: '(//section[@class="aktivitetvisning__underseksjon"])[1]',
            elements: {
                labelForslag: '//label[@for="id--BRUKER_ER_INTERESSERT"]',
                labelPlanlegger: '//label[@for="id--PLANLAGT"]',
                labelGjennomforer: '//label[@for="id--GJENNOMFORES"]',
                labelFullfort: '//label[@for="id--FULLFORT"]',
                labelAvbrutt: '//label[@for="id--AVBRUTT"]',
                rdioForslag: '//input[@id="id--BRUKER_ER_INTERESSERT"]',
                rdioPlanlegger: '//input[@id="id--PLANLAGT"]',
                rdioGjennomforer: '//input[@id="id--GJENNOMFORES"]',
                rdioFullfort: '//input[@id="id--FULLFORT"]',
                rdioAvbrutt: '//input[@id="id--AVBRUTT"]',
                btnBekreft: '//button[contains(@class, "oppdater-status")]',
                ikonAlert:
                    '//div[@class="status-alert"]//span[@class="alertstripe__ikon"]',
                txtAlert:
                    '//div[@class="status-alert"]//span[contains(@class, "alertstripe__tekst")]/span',
            },
            commands: [
                {
                    hentStatusSelektor(status) {
                        const selectorId =
                            AktivitetStatus.properties[status].selectorId;
                        const label = `label${selectorId}`;
                        const rdio = `rdio${selectorId}`;

                        return {
                            label: this.elements[label].selector,
                            rdio: this.elements[rdio].selector,
                        };
                    },
                },
            ],
        },

        tilstandSection: {
            selector: '(//section[@class="aktivitetvisning__underseksjon"])[2]',
            elements: {
                labelIngen: '//label[@for="id--INGEN_VALGT"]',
                labelSoknadSendt: '//label[@for="id--SOKNAD_SENDT"]',
                labelInnkalt: '//label[@for="id--INNKALT_TIL_INTERVJU"]',
                labelAvslag: '//label[@for="id--AVSLAG"]',
                labelJobbtilbud: '//label[@for="id--JOBBTILBUD"]',
                rdioIngen: '//input[@id="id--INGEN_VALGT"]',
                rdioSoknadSendt: '//input[@id="id--SOKNAD_SENDT"]',
                rdioInnkalt: '//input[@id="id--INNKALT_TIL_INTERVJU"]',
                rdioAvslag: '//input[@id="id--AVSLAG"]',
                rdioJobbtilbud: '//input[@id="id--JOBBTILBUD"]',
                btnBekreft: '//button[contains(@class, "oppdater-status")]',
            },
            commands: [
                {
                    hentTilstandSelektor(status) {
                        const selectorId =
                            AktivitetTilstand.properties[status].selectorId;
                        const label = `label${selectorId}`;
                        const rdio = `rdio${selectorId}`;

                        return {
                            label: this.elements[label].selector,
                            rdio: this.elements[rdio].selector,
                        };
                    },
                },
            ],
        },
    },
};
