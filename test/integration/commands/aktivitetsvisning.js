import { AktivitetsType } from '../data/aktivitet-type';
import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

module.exports = {
    validerInnhold(aktivitet) {
        this.api.validerTekst(
            this.elements.txtSideTittel.selector,
            aktivitet.tittel,
            'Aktivitetsvisning: Validerer sidetittel'
        );

        if (aktivitet.type === AktivitetsType.STILLING)
            this.validerStilling(aktivitet);
        else if (aktivitet.type === AktivitetsType.EGENAKTIVITET)
            this.validerEgenaktivitet(aktivitet);
        else if (aktivitet.type === AktivitetsType.MOTE)
            this.validerMote(aktivitet);
        else if (aktivitet.type === AktivitetsType.AVTALE)
            this.validerSokeJobber(aktivitet);
        else if (aktivitet.type === AktivitetsType.MEDISINSKBEHANDLING)
            this.validerMedisinsk(aktivitet);
        else if (aktivitet.type === AktivitetsType.ARENA)
            this.validerArena(aktivitet);
        else
            this.assert.fail(
                `Validering av innhold for ${AktivitetsType[aktivitet.type]
                    .oversiktNavn} er ikke implementert`
            );

        this.validerStatus(aktivitet.kolonne, aktivitet.type);
        return this;
    },

    validerStilling(data) {
        const msg = 'Aktivitetsvisning: ',
            side = this.elements;
        this.valider(side.txtFraDato, data.fraDatoMedMnd, `${msg}Fra dato`);
        this.valider(
            side.txtBeskrivelse,
            data.beskrivelse,
            `${msg}Beskrivelse`
        );
        this.validerLenkeFelt(side.lenke, data.lenke, `${msg}Lenke`);
        this.valider(side.txtTilDato, data.tilDatoMedMnd, `${msg}Frist`);
        this.valider(
            side.txtKontaktperson,
            data.kontaktperson,
            `${msg}Kontaktperson`
        );
        this.valider(
            side.txtArbeidsgiver,
            data.arbeidsgiver,
            `${msg}Arbeidsgiver`
        );
        this.valider(
            side.txtArbeidssted,
            data.arbeidssted,
            `${msg}Arbeidssted`
        );

        this.validerTilstand(data.kolonne);
    },

    validerEgenaktivitet(data) {
        const msg = 'Aktivitetsvisning: ',
            side = this.elements;
        this.valider(side.txtFraDato, data.fraDatoMedMnd, `${msg}Fra dato`);
        this.valider(
            side.txtBeskrivelse,
            data.beskrivelse,
            `${msg}Beskrivelse`
        );
        this.valider(side.lenke, data.lenke, `${msg}Lenke`);
        this.valider(side.txtTilDato, data.tilDatoMedMnd, `${msg}Til dato`);
        this.valider(side.txtHensikt, data.hensikt, `${msg}Hensikt`);
        this.valider(side.txtHuskeliste, data.huskeliste, `${msg}Huskeliste`);
    },

    validerMote(data) {
        const msg = 'Aktivitetsvisning: ',
            side = this.elements;
        this.valider(side.txtDato, data.fraDatoMedMnd, `${msg}Dato`);
        this.valider(
            side.txtKlokkeslett,
            data.klokkeslett,
            `${msg}Klokkeslett`
        );
        this.valider(side.txtKanal, data.moteform, `${msg}Møteform`);
        this.valider(side.txtVarighet, data.varighet, `${msg}Varighet`);
        this.valider(side.txtAdresse, data.motested, `${msg}Møtested`);
        this.valider(side.txtBakgrunn, data.hensikt, `${msg}Hensikt`);
        this.valider(
            side.txtForberedelser,
            data.forberedelser,
            `${msg}Forberedelser`
        );
    },

    validerSokeJobber(data) {
        const msg = 'Aktivitetsvisning: ',
            side = this.elements;
        this.valider(side.txtFraDato, data.fraDatoMedMnd, `${msg}Fra dato`);
        this.valider(side.txtTilDato, data.tilDatoMedMnd, `${msg}Til dato`);
        this.valider(side.txtAntall, data.antallSoknader, `${msg}Antall`);
        this.valider(
            side.txtOppfolging,
            data.oppfolgingFraNav,
            `${msg}Oppfølging`
        );
        this.valider(
            side.txtBeskrivelse,
            data.beskrivelse,
            `${msg}Beskrivelse`
        );
    },

    validerMedisinsk(data) {
        const msg = 'Aktivitetsvisning: ',
            side = this.elements;
        this.valider(
            side.txtBehandlingType,
            data.behandlingsType,
            `${msg}Behandlingstype`
        );
        this.valider(
            side.txtBehandlingType,
            data.behandlingsType,
            `${msg}Behandlingstype`
        );
        this.valider(side.txtFraDato, data.fraDatoMedMnd, `${msg}Fra dato`);
        this.valider(side.txtTilDato, data.tilDatoMedMnd, `${msg}Til dato`);
        this.valider(
            side.txtBehandlingOppfolgning,
            data.oppfolgingFraNav,
            `${msg}Mål`
        );
        this.valider(
            side.txtBeskrivelse,
            data.beskrivelse,
            `${msg}Beskrivelse`
        );
    },

    validerArena(data) {
        const msg = 'Aktivitetsvisning: ',
            side = this.elements;
        this.valider(side.txtFraDato, data.fraDatoMedMnd, `${msg}Fra dato`);
        this.valider(side.txtTilDato, data.tilDatoMedMnd, `${msg}Til dato`);
        this.valider(side.txtArrangoer, data.arrangoer, `${msg}Arrangør`);
        this.valider(
            side.txtDeltakelseProsent,
            data.deltakelseProsent,
            `${msg}Deltakelse`
        );
        this.valider(
            side.txtDagerPerUke,
            data.antallDagerPerUke,
            `${msg}Dager per uke`
        );
        this.valider(
            side.txtBeskrivelse,
            data.beskrivelse,
            `${msg}Dager per uke`
        );
    },

    valider(element, forventet, melding) {
        const msg = `Forventet at <${melding}> ikke skulle være synlig`;

        if (forventet.length === 0) {
            this.api.elements('xpath', element.selector, elements => {
                this.assert.equal(elements.value.length, 0, msg);
            });
        } else this.api.validerTekst(element.selector, forventet, melding);
    },

    validerLenkeFelt(element, forventet, melding) {
        const msg = `Forventet at <${melding}> ikke skulle være synlig`;

        if (forventet.length === 0) {
            this.api.elements('xpath', element.selector, elements => {
                this.assert.equal(elements.value.length, 0, msg);
            });
        } else this.api.validerLenke(element.selector, forventet, melding);
    },

    validerStatus(status, aktivitetsType) {
        const disabledAtt = 'disabled',
            section = this.section.statusSection,
            forventet = this.hentForventetStatus(status, aktivitetsType);

        if (aktivitetsType === AktivitetsType.ARENA) {
            this.assert.elementNotPresent(section.selector);
            return;
        }
        forventet.forEach(element => {
            const statusRdio = section.hentStatusSelektor(element.status).rdio;
            const msgTekst =
                'Validerer aktivert/deaktivert status: ' +
                AktivitetStatus.properties[element.status].value;

            this.waitForElementPresent(statusRdio, this.api.globals.timeout);
            this.getAttribute(statusRdio, disabledAtt, callback => {
                this.assert.equal(
                    String(callback.value),
                    element.disablet,
                    msgTekst
                );
            });
        });

        return this;
    },

    hentForventetStatus(status, aktivitetType) {
        let forventedeStatuser = [
            { status: AktivitetStatus.FORSLAG, disablet: 'null' },
            { status: AktivitetStatus.PLANLEGGER, disablet: 'null' },
            { status: AktivitetStatus.GJENNOMFORES, disablet: 'null' },
            { status: AktivitetStatus.FULLFORT, disablet: 'null' },
            { status: AktivitetStatus.AVBRUTT, disablet: 'null' },
        ];

        if (
            status === AktivitetStatus.FULLFORT ||
            status === AktivitetStatus.AVBRUTT
        ) {
            forventedeStatuser.forEach(x => (x.disablet = 'true'));
        }

        return forventedeStatuser;
    },

    validerTilstand(status) {
        const disabledAtt = 'disabled';
        const forventedeTilstander = this.hentForventetTilstand(status);

        forventedeTilstander.forEach(forventet => {
            const tilstandRdio = this.section.tilstandSection.hentTilstandSelektor(
                forventet.status
            ).rdio;
            const msgTekst =
                'Validerer aktivert/deaktivert status: ' +
                AktivitetTilstand.properties[forventet.status].value;
            this.waitForElementPresent(tilstandRdio, this.api.globals.timeout);
            this.getAttribute(tilstandRdio, disabledAtt, callback => {
                this.assert.equal(
                    String(callback.value),
                    forventet.disablet,
                    msgTekst
                );
            });
        });
    },

    hentForventetTilstand(status) {
        let forventedeStatuser = [
            { status: AktivitetTilstand.INGEN, disablet: 'null' },
            { status: AktivitetTilstand.SOKNADSENDT, disablet: 'null' },
            { status: AktivitetTilstand.INNKALT, disablet: 'null' },
            { status: AktivitetTilstand.AVSLAG, disablet: 'null' },
            { status: AktivitetTilstand.JOBBTILBUD, disablet: 'null' },
        ];

        if (
            status === AktivitetStatus.FULLFORT ||
            status === AktivitetStatus.AVBRUTT
        ) {
            forventedeStatuser.forEach(x => (x.disablet = 'true'));
        }

        return forventedeStatuser;
    },

    trykkEndre(nesteSide) {
        let timeout = this.api.globals.timeout;
        this.api.waitForElementVisible(
            this.elements.btnEndre.selector,
            timeout
        );
        this.click(this.elements.btnEndre.selector);
        this.waitForElementNotPresent(
            this.elements.side.selector,
            timeout
        ).waitForElementVisible(nesteSide.elements.btnLagre.selector, timeout);

        return nesteSide;
    },

    setStatus(status) {
        const section = this.section.statusSection;
        let rdioSelector = section.hentStatusSelektor(status).label;
        const btnBekreft = section.elements.btnBekreft.selector;
        const timeout = this.api.globals.timeout;

        this.click(rdioSelector).waitForElementVisible(btnBekreft, timeout);

        if (
            status === AktivitetStatus.FULLFORT ||
            status === AktivitetStatus.AVBRUTT
        ) {
            this.assert.visible(section.elements.ikonAlert.selector);
            this.assert.visible(section.elements.txtAlert.selector);
        }

        this.click(btnBekreft);
        this.waitForElementNotPresent(btnBekreft, timeout);
        return this;
    },

    markerAvtaltMedNav() {
        const timeout = this.api.globals.timeout,
            side = this.elements,
            msg = 'Avtalt med NAV';
        this.click(side.rdioAvtaltMedNav.selector).waitForElementVisible(
            side.btnBekreftAvtaltMedNav.selector,
            timeout
        );
        this.click(side.btnBekreftAvtaltMedNav.selector).waitForElementVisible(
            side.txtAvtaltMedNav.selector,
            timeout
        );
        this.assert.containsText(side.txtAvtaltMedNav.selector, msg);
        return this;
    },

    setTilstand(tilstand) {
        const section = this.section.tilstandSection;
        let rdioSelector = section.hentTilstandSelektor(tilstand).label;
        let btnBekreft = section.elements.btnBekreft.selector;
        let timeout = this.api.globals.timeout;

        this.waitForElementVisible(rdioSelector, timeout)
            .click(rdioSelector)
            .waitForElementVisible(btnBekreft, timeout)
            .click(btnBekreft)
            .waitForElementNotPresent(btnBekreft, timeout);

        return this;
    },

    slettAktivitet(nesteside) {
        const timeout = this.api.globals.timeout,
            side = this.elements;

        this.waitForElementVisible(side.btnSlett.selector, timeout);
        this.api.pause(500); // slett knapp har en tendens til å bli utdatert(stale).
        this.click(side.btnSlett.selector, callback => {
            if (callback.status !== 0) {
                console.log(callback);
                this.click(side.btnSlett.selector);
            }
        })
            .waitForElementPresent(side.wndBekreftSletting.selector, timeout)
            .click(side.btnBekreftSletting.selector)
            .waitForElementNotPresent(
                side.wndBekreftSletting.selector,
                timeout
            );
        return nesteside;
    },

    leggTilDialog(dialog) {
        this.click(this.elements.btnDialog.selector);
        this.api.page.dialogvisning().leggTilMelding(dialog, false);
        return this;
    },

    lukkVindu(nesteSide) {
        var timeout = this.api.globals.timeout;
        this.click(this.elements.btnLukk.selector);
        this.waitForElementVisible(nesteSide.elements.side.selector, timeout);
        return nesteSide;
    },
};
