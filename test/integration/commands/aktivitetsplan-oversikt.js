'use strict';
import { getParentPathByChildText } from '../utils';
import { AktivitetsType } from '../data/aktivitet-type';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

module.exports = {
    ventPaSideLast() {
        let timeout = this.api.globals.timeout;
        const pageObjects = this.elements;
        this.waitForElementVisible(
            pageObjects.btnLeggTilAktivitet.selector,
            timeout
        )
            .waitForElementVisible(pageObjects.kolForslag.selector, timeout)
            .waitForElementVisible(pageObjects.cbFilter.selector, timeout);
    },

    leggTilOgValiderAktivitet(aktivitet, kunObligatoriske = true) {
        const sider = this.api.page;
        this.ventPaSideLast();
        const aktivitetVindu = this.trykkLeggTilAktivitet(
            sider.nyAktivitetModal()
        ).velgAktivitetsType(aktivitet.type, sider.aktivitetModal());

        if (kunObligatoriske)
            aktivitetVindu.oppgiObligatoriskeVerdier(aktivitet);
        else aktivitetVindu.oppgiAlleVerdier(aktivitet);

        aktivitetVindu
            .lagre(sider.aktivitetsvisningModal())
            .validerInnhold(aktivitet);

        this.api
            .url(result => {
                aktivitet.aktivitetURL = result.value;
            })
            .perform(function() {
                sider
                    .aktivitetsvisningModal()
                    .lukkVindu(this.api.page.aktivitetsplanOversiktSide())
                    .validerAktivitet(aktivitet);
            });
        return aktivitet;
    },

    trykkLeggTilAktivitet(nesteSide) {
        const pageObjects = this.elements;
        let timeout = this.api.globals.timeout;

        this.click(
            pageObjects.btnLeggTilAktivitet.selector
        ).waitForElementVisible(nesteSide.elements.side.selector, timeout);
        return nesteSide;
    },

    validerAktivitet(aktivitet) {
        const aktivitetsKortSelector =
            this.hentKolonneSelektor(aktivitet.kolonne) +
            this.aktivitetskortHref(aktivitet.aktivitetURL);
        const typeSelektor = this.hentAktivitetTypeSelektor(
            aktivitetsKortSelector,
            aktivitet.type
        );

        this.assert.visible(typeSelektor);

        this.api.validerTekst(
            aktivitetsKortSelector + this.elements.tittel.selector,
            aktivitet.tittel,
            'Aktivitetsplan oversikt: tittel'
        );

        this.api.validerTekst(
            aktivitetsKortSelector + this.elements.dato.selector,
            aktivitet.aktivitetskortDato,
            'Aktivitetsplan oversikt: dato'
        );

        if (aktivitet.tilstand === AktivitetTilstand.INGEN) {
            this.api.assert.elementNotPresent(
                aktivitetsKortSelector + this.elements.etikett.selector,
                'Aktivitetsplan oversikt: tilstand Ingen'
            );
        } else {
            const merkelapp = this.hentMerkelappSelektor(
                aktivitetsKortSelector,
                aktivitet.tilstand
            );
            this.api.assert.visible(merkelapp);
        }
        if (aktivitet.type === AktivitetsType.AVTALE) {
            const expected =
                'Antall søknader i perioden: ' + aktivitet.antallSoknader;
            this.api.validerTekst(
                aktivitetsKortSelector + this.elements.antallSoknader.selector,
                expected,
                'Aktivitetsplan oversikt: Antall'
            );
        }
        return this;
    },

    velgAktivitetMedHref(kolonne, url) {
        const timeout = this.api.globals.timeout;
        const xPath =
            this.hentKolonneSelektor(kolonne) + this.aktivitetskortHref(url);
        const nesteSide = this.api.page.aktivitetsvisningModal();
        this.api.click(xPath);
        this.api.waitForElementVisible(
            nesteSide.elements.side.selector,
            timeout
        );
        return nesteSide;
    },

    validerSletting(kolonne, url) {
        const timeout = this.api.globals.timeout;
        let xPath =
            this.hentKolonneSelektor(kolonne) + this.aktivitetskortHref(url);
        this.api.waitForElementNotPresent(xPath, timeout);
        return this;
    },

    velgAktivitetMedTittel(kolonne, tittel, nesteSide) {
        let timeout = this.api.globals.timeout;
        let xPathAk = this.hentKolonneSelektor(kolonne);

        getParentPathByChildText(
            this.api,
            tittel,
            xPathAk,
            this.elements.tittel.selector,
            timeout,
            callback => {
                if (callback.success) this.api.click(callback.value);
            }
        );
        this.api.waitForElementVisible(
            nesteSide.elements.side.selector,
            timeout
        );

        return nesteSide;
    },

    klikkDialog(nesteSide) {
        let timeout = this.api.globals.timeout;
        this.waitForElementVisible(this.elements.linkDialog.selector, timeout)
            .click(this.elements.linkDialog.selector)
            .waitForElementVisible(nesteSide.elements.side.selector, timeout);

        return nesteSide;
    },
};
