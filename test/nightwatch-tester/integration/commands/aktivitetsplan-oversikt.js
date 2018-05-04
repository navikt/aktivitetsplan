'use strict';
import { getParentPathByChildText } from '../utils';
import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetsType } from '../data/aktivitet-type';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

module.exports = {
    ventPaSideLast() {
        let timeout = this.api.globals.test_settings.timeout;
        const pageObjects = this.elements;
        this.waitForElementVisible(
            pageObjects.btnLeggTilAktivitet.selector,
            timeout
        )
            .waitForElementVisible(pageObjects.kolForslag.selector, timeout)
            .waitForElementVisible(pageObjects.cbFilter.selector, timeout)
            .waitForElementVisible(
                pageObjects.btnLeggTilAktivitet.selector,
                timeout
            );
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
        let timeout = this.api.globals.test_settings.timeout;

        this.click(
            pageObjects.btnLeggTilAktivitet.selector
        ).waitForElementVisible(nesteSide.elements.side.selector, timeout);
        return nesteSide;
    },

    validerAktivitet(aktivitet) {
        const aktivitetsKortSelector =
            this.genererXpathForForKolonne(aktivitet.kolonne) +
            this.aktivitetskortHref(aktivitet.aktivitetURL);

        this.api.validerTekst(
            aktivitetsKortSelector + this.elements.tittel.selector,
            aktivitet.tittel,
            'Aktivitetsplan oversikt: tittel'
        );

        this.api.validerTekst(
            aktivitetsKortSelector + this.elements.type.selector,
            AktivitetsType.properties[aktivitet.type].oversiktNavn,
            'Aktivitetsplan oversikt: type'
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
            const tilstand =
                AktivitetTilstand.properties[aktivitet.tilstand].value;
            this.api.validerTekst(
                aktivitetsKortSelector + this.elements.etikett.selector,
                tilstand,
                'Aktivitetsplan oversikt: tilstand:' + tilstand
            );
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
        const timeout = this.api.globals.test_settings.timeout;
        const xPath =
            this.genererXpathForForKolonne(kolonne) +
            this.aktivitetskortHref(url);
        const nesteSide = this.api.page.aktivitetsvisningModal();
        this.api.click(xPath);
        this.api.waitForElementVisible(
            nesteSide.elements.side.selector,
            timeout
        );
        return nesteSide;
    },

    validerSletting(kolonne, url) {
        const timeout = this.api.globals.test_settings.timeout;
        let xPath =
            this.genererXpathForForKolonne(kolonne) +
            this.aktivitetskortHref(url);
        this.api.waitForElementNotPresent(xPath, timeout);
        return this;
    },

    velgAktivitetMedTittel(kolonne, tittel, nesteSide) {
        let timeout = this.api.globals.test_settings.timeout;
        let xPathAk = this.genererXpathForAktivitetskort(kolonne);

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

    genererXpathForForKolonne(kolonne) {
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

    genererXpathForAktivitetskort(kolonne) {
        var kolonne = this.genererXpathForForKolonne(kolonne);
        return kolonne + this.elements.aktivitetsKort.selector;
    },

    klikkDialog(nesteSide) {
        let timeout = this.api.globals.test_settings.timeout;
        this.waitForElementVisible(this.elements.linkDialog.selector, timeout)
            .click(this.elements.linkDialog.selector)
            .waitForElementVisible(nesteSide.elements.side.selector, timeout);

        return nesteSide;
    },
};
