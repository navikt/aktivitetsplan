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

        this.api.getText(
            aktivitetsKortSelector + this.elements.tittel.selector,
            tittel => {
                this.api.assert.equal(
                    tittel.status,
                    0,
                    'Aktivitetsplan oversikt: tittel'
                );
                this.api.verify.equal(
                    tittel.value,
                    aktivitet.tittel,
                    'Aktivitetsplan oversikt: tittel'
                );
            }
        );

        this.api.getText(
            aktivitetsKortSelector + this.elements.type.selector,
            type => {
                this.api.assert.equal(
                    type.status,
                    0,
                    'Aktivitetsplan oversikt: type'
                );
                this.api.verify.equal(
                    type.value,
                    AktivitetsType.properties[aktivitet.type].oversiktNavn,
                    'Aktivitetsplan oversikt: type'
                );
            }
        );

        this.api.getText(
            aktivitetsKortSelector + this.elements.dato.selector,
            dato => {
                this.api.assert.equal(
                    dato.status,
                    0,
                    'Aktivitetsplan oversikt: dato'
                );
                this.api.verify.equal(
                    dato.value,
                    aktivitet.aktivitetskortDato,
                    'Aktivitetsplan oversikt: dato'
                );
            }
        );

        if (aktivitet.tilstand === AktivitetTilstand.INGEN) {
            this.api.assert.elementNotPresent(
                aktivitetsKortSelector + this.elements.etikett.selector,
                'Aktivitetsplan oversikt: tilstand Ingen'
            );
        } else {
            this.api.getText(
                aktivitetsKortSelector + this.elements.etikett.selector,
                tilstand => {
                    this.api.assert.equal(
                        tilstand.status,
                        0,
                        'Aktivitetsplan oversikt: tilstand'
                    );
                    this.api.verify.equal(
                        tilstand.value,
                        AktivitetTilstand.properties[aktivitet.tilstand].value,
                        'Aktivitetsplan oversikt: tilstand:' +
                            aktivitet.tilstand
                    );
                }
            );
        }
        if (aktivitet.type === AktivitetsType.AVTALE) {
            this.api.getText(
                aktivitetsKortSelector + this.elements.antallSoknader.selector,
                antall => {
                    const expected =
                        'Antall søknader i perioden: ' +
                        aktivitet.antallSoknader;
                    this.api.assert.equal(
                        antall.status,
                        0,
                        'Aktivitetsplan oversikt: Antall'
                    );
                    this.api.verify.equal(
                        antall.value,
                        expected,
                        'Aktivitetsplan oversikt: Antall'
                    );
                }
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
            case AktivitetStatus.GJENNOMFORER:
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
