import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetsType } from '../data/aktivitet-type';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

const aktivitetsPlanOversikt = require('../commands/aktivitetsplan-oversikt.js');

module.exports = {
    url: function() {
        return this.api.globals.baseUrl;
    },

    commands: [
        aktivitetsPlanOversikt,
        {
            aktivitetskortHref(url) {
                let href = url
                    .replace(this.api.globals.FSSBaseUrl, '')
                    .replace(this.api.globals.SBSBaseUrl, '');
                href = href.split('?')[0];
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
            '//div[@class="verktoylinje__verktoy-container"]/button | //div[@class="verktoylinje__verktoy-container"]/a[@role="button"]',
        cbFilter:
            '//div[@class="verktoylinje"]//button[@class="dropdown__btn"]',
        tavle: '//section[contains(@class, "aktivitetstavle")]',
        kolForslag: '//*[@data-testid="aktivitetstavle.BRUKER_ER_INTERESSERT"]',
        kolPlanlegger: '//*[@data-testid="aktivitetstavle.PLANLAGT"]/div/div',
        kolGjennomForer: '//*[@data-testid="aktivitetstavle.GJENNOMFORES"]',
        kolFullfort: '//*[@data-testid="aktivitetstavle.FULLFORT"]',
        kolAvbrutt: '//*[@data-testid="aktivitetstavle.AVBRUTT"]',
        aktivitetsKort: '//a[contains(@class, "aktivitetskort")]',
        tittel: '//h1',
        dato: '//p[contains(@class, "aktivitetskort__dato")]',
        type: '//p[contains(@class, "aktivitetskort__type")]/span',
        etikett: '//span[contains(@class, "etikett")]/span',
        antallSoknader: '//*[@data-testid="antall-stillinger"]',
        linkDialog:
            '//a[contains(@class,"knappelenke") and contains(@href, "/dialog")]',
    },
};
