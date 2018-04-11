const aktivitetsPlanOversikt = require('../commands/aktivitetsplan-oversikt.js');
const aktivitetsPlanOversiktIntern = require('../commands/aktivitetsplan-oversikt-intern.js');

module.exports = {
    url: function() {
        return (
            this.api.globals.test_settings.baseUrl + '/aktivitetsplanfelles/'
        );
    },

    commands: [
        aktivitetsPlanOversikt,
        aktivitetsPlanOversiktIntern,
        {
            aktivitetskortHref(url) {
                let href = url.replace(
                    this.api.globals.test_settings.baseUrl,
                    ''
                );
                return `//a[contains(@class, "aktivitetskort") and @href="${href}"]`;
            },
        },
    ],

    elements: {
        side: '//section[contains(@class, "aktivitetstavle")]',
        btnLeggTilAktivitet:
            '//div[@class="verktoylinje__verktoy"]/button | //div[@class="verktoylinje__verktoy"]/a[@role="button"]',
        cbFilter: '//button[@class="dropdown__btn"]',
        tavle: '//section[contains(@class, "aktivitetstavle")]',
        kolForslag: '//section[@class="tavle-kolonne"][1]',
        kolPlanlegger: '//section[@class="tavle-kolonne"][2]/div/div',
        kolGjennomForer: '//section[@class="tavle-kolonne"][3]',
        kolFullfort: '//section[@class="tavle-kolonne"][4]',
        kolAvbrutt: '//section[@class="tavle-kolonne"][5]',
        aktivitetsKort: '//a[contains(@class, "aktivitetskort")]',
        tittel: '/h1',
        dato: '/p[contains(@class, "aktivitetskort__dato")]',
        type: '/p[contains(@class, "aktivitetskort__type")]/span',
        etikett: '//span[contains(@class, "etikett")]/span',
        antallSoknader: '/div',
        linkDialog:
            '//a[contains(@class,"navigasjonslinje__lenke") and contains(@href, "/dialog")]',
    },

    sections: {
        InternSection: {
            selector: '//div[@class="aktivitetsplanfs"]',
            elements: {
                alertText:
                    '//span[contains(@class, "alertstripe__tekst")]/span',
                lenkeNavigasjonsLenke:
                    '//a[contains(@class, "navigasjonslinje__lenke")]',
            },
        },
    },
};
