import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetsType } from '../data/aktivitet-type';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

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

            hentKolonneSelektor(kolonne) {
                const elementer = this.elements;
                switch (kolonne) {
                    case AktivitetStatus.FORSLAG:
                        return elementer.kolForslag.selector;
                    case AktivitetStatus.PLANLEGGER:
                        return elementer.kolPlanlegger.selector;
                    case AktivitetStatus.GJENNOMFORES:
                        return elementer.kolGjennomForer.selector;
                    case AktivitetStatus.FULLFORT:
                        return elementer.kolFullfort.selector;
                    case AktivitetStatus.AVBRUTT:
                        return elementer.kolAvbrutt.selector;
                    default:
                        return undefined;
                }
            },

            hentXpathForAktivitetskort(kolonne) {
                var kolonne = this.hentKolonneSelektor(kolonne);
                return kolonne + this.elements.aktivitetsKort.selector;
            },

            hentAktivitetTypeSelektor(prefix, aktivitetstype) {
                const id = AktivitetsType.properties[aktivitetstype].testId;
                return `${prefix}//*[@data-testid="${id}"]`;
            },

            hentMerkelappSelektor(prefix, aktivitetstilstand) {
                const id =
                    AktivitetTilstand.properties[aktivitetstilstand]
                        .merkelappId;
                return `${prefix}//*[@data-testid="${id}"]`;
            },
        },
    ],

    elements: {
        side: '//section[contains(@class, "aktivitetstavle")]',
        btnLeggTilAktivitet:
            '//div[@class="verktoylinje__verktoy"]/button | //div[@class="verktoylinje__verktoy"]/a[@role="button"]',
        cbFilter: '//button[@class="dropdown__btn"]',
        tavle: '//section[contains(@class, "aktivitetstavle")]',
        kolForslag: '//*[@data-testid="aktivitetstavle.brukerErInteressert"]',
        kolPlanlegger: '//*[@data-testid="aktivitetstavle.planlagt"]/div/div',
        kolGjennomForer: '//*[@data-testid="aktivitetstavle.gjennomfoert"]',
        kolFullfort: '//*[@data-testid="aktivitetstavle.fullfoert"]',
        kolAvbrutt: '//*[@data-testid="aktivitetstavle.avbrutt"]',
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
