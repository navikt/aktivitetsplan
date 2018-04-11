const aktivitetsvisning = require('../commands/aktivitetsvisning.js');

module.exports = {
    url: function() {
        return (
            this.api.globals.test_settings.baseUrl +
            '/aktivitetsplan/aktivitet/vis'
        );
    },

    elements: {
        side: '//section[@class="aktivitetsvisning"]',
        btnLukk: '//button[contains(@class, "lukknapp")]',
        txtSideTittel: '//h1[@id="modal-aktivitetsvisning-header"]',
        detaljFelt:
            '//div[contains(@class,"aktivitetsdetaljer__felt detaljfelt")]',
        detaljFeltTittel: '/h2/span',
        detaljFeltTekst: '/*[contains(@class, "detaljfelt__tekst")]',
        detaljFeltLenke: '/a[@class="detaljfelt__lenke eksternlenke lenke"]',
        txtFraDato: '(//p[contains(@class, "detaljfelt__tekst")])[1]',
        txtTilDato: '(//p[contains(@class, "detaljfelt__tekst")])[2]',
        btnEndre:
            '//button[contains(@class, "knapp knapp-liten modal-footer__knapp knapp--hoved")]',
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
        },

        tilstandSection: {
            selector: '(//section[@class="aktivitetvisning__underseksjon"])[2]',
            elements: {
                labelIngen: '//label[@for="id--INGEN_VALGT"]',
                labelSoknadSendt: '//label[@for="id--SOKNAD_SENDT"]',
                labelInnkaltTilIntervju:
                    '//label[@for="id--INNKALT_TIL_INTERVJU"]',
                labelAvslag: '//label[@for="id--AVSLAG"]',
                labelJobbtilbud: '//label[@for="id--JOBBTILBUD"]',
                rdioIngen: '//input[@id="id--INGEN_VALGT"]',
                rdioSoknadSendt: '//input[@id="id--SOKNAD_SENDT"]',
                rdioInnkaltTilIntervju:
                    '//input[@id="id--INNKALT_TIL_INTERVJU"]',
                rdioAvslag: '//input[@id="id--AVSLAG"]',
                rdioJobbtilbud: '//input[@id="id--JOBBTILBUD"]',
                btnBekreft: '//button[contains(@class, "oppdater-status")]',
            },
        },
    },
};
