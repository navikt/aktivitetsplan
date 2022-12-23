import './demoDashboard.less';

import { CheckboksPanelGruppe, RadioPanelGruppe } from 'nav-frontend-skjema';
import { Innholdstittel } from 'nav-frontend-typografi';
import React from 'react';

import { ALL_FEATURES } from '../../felles-komponenter/feature/feature';
import Hurtigfilter from './hurtigfilter';
import {
    LocalStorageElement,
    aktivitetFeilet,
    arenaFeilet,
    dialogFeilet,
    erEksternBruker,
    erEskalertBruker,
    erEskalertBrukerGammel,
    erKRRBruker,
    erManuellBruker,
    erPrivatBruker,
    featureStatus,
    ikkeLoggetInnNivaa4,
    ingenMal,
    ingenOppfPerioder,
    maalFeilet,
    nivaa4Feilet,
    oppdateringKunFeiler,
    oppfFeilet,
    setFeatureTogle,
    settLocalStorage,
    ulesteDialoger,
    visArenaAktiviteter,
    visAutomatiskeAktiviteter,
    visEksterneAktiviteter,
    visTestAktiviteter,
} from './sessionstorage';

const brukertype = {
    ekstern: 'eksternbruker',
    veileder: 'veilederbruker',
};

class DemoDashboard extends React.Component {
    setFeature = (e, name) => {
        setFeatureTogle(name, e.currentTarget.checked);
        window.location.reload();
    };

    endreTilstand = (e) => {
        const checkbox = e.currentTarget;
        const saveInSessionStorage = Object.values(LocalStorageElement).indexOf(checkbox.id) > -1;

        if (saveInSessionStorage) {
            settLocalStorage(checkbox.id, checkbox.checked);
            window.location.reload();
        }
    };

    endreBrukerType = (e) => {
        const element = e.currentTarget;
        const erVeileder = element.id === brukertype.veileder;

        settLocalStorage(LocalStorageElement.EKSTERN_BRUKER, !erVeileder);
        window.location.reload();
    };

    getBrukerType = () => {
        if (erEksternBruker()) {
            return brukertype.ekstern;
        } else return brukertype.veileder;
    };
    render() {
        return (
            <section className="demodashboard">
                <Innholdstittel className="blokk-s">DEMO</Innholdstittel>
                <Hurtigfilter />
                <RadioPanelGruppe
                    legend="Brukertype"
                    name="brukertype-rdio-panel"
                    radios={[
                        {
                            label: 'Veileder',
                            id: brukertype.veileder,
                            value: brukertype.veileder,
                        },
                        {
                            label: 'Eksternbruker',
                            id: brukertype.ekstern,
                            value: brukertype.ekstern,
                        },
                    ]}
                    checked={this.getBrukerType()}
                    onChange={this.endreBrukerType}
                />
                <CheckboksPanelGruppe
                    legend="Brukers tilstand"
                    checkboxes={[
                        {
                            label: 'Ikke under oppfølging',
                            id: LocalStorageElement.PRIVAT_BRUKER,
                            checked: erPrivatBruker(),
                        },
                        {
                            label: 'Manuell',
                            id: LocalStorageElement.MANUELL_BRUKER,
                            checked: erManuellBruker(),
                        },
                        {
                            label: 'KRR',
                            id: LocalStorageElement.KRR_BRUKER,
                            checked: erKRRBruker(),
                        },
                        {
                            label: 'Ikke innlogget med nivå 4',
                            id: LocalStorageElement.INNLOGGET_NIVAA4,
                            checked: ikkeLoggetInnNivaa4(),
                        },
                        {
                            label: 'Ingen oppfølgingsperioder',
                            id: LocalStorageElement.INGEN_OPPF_PERIODER,
                            checked: ingenOppfPerioder(),
                        },
                        {
                            label: 'Gammel eskaleringsvarsel',
                            id: LocalStorageElement.GAMMEL_ESKALERT_BRUKER,
                            checked: erEskalertBrukerGammel(),
                        },
                        {
                            label: 'Eskaleringsvarsel',
                            id: LocalStorageElement.ESKALERT_BRUKER,
                            checked: erEskalertBruker(),
                        },
                        {
                            label: 'Uleste dialoger',
                            id: LocalStorageElement.ULESTE_DIALOGER,
                            checked: ulesteDialoger(),
                        },
                    ]}
                    onChange={this.endreTilstand}
                />
                <CheckboksPanelGruppe
                    legend="Aktivitet tilstand"
                    checkboxes={[
                        {
                            label: 'Automatiske aktiviteter',
                            id: LocalStorageElement.AUTOMATISKE_AKTIVITETER,
                            checked: visAutomatiskeAktiviteter(),
                        },
                        {
                            label: 'Arenaaktiviteter',
                            id: LocalStorageElement.ARENA_AKTIVITETER,
                            checked: visArenaAktiviteter(),
                        },
                        {
                            label: 'Testaktiviteter',
                            id: LocalStorageElement.TEST_AKTIVITETER,
                            checked: visTestAktiviteter(),
                        },
                        {
                            label: 'Eksterne aktiviteter',
                            id: LocalStorageElement.EKSTERNE_AKTIVITETER,
                            checked: visEksterneAktiviteter(),
                        },
                    ]}
                    onChange={this.endreTilstand}
                />
                <CheckboksPanelGruppe
                    legend="Feature togles"
                    checkboxes={ALL_FEATURES.map((name) => {
                        return {
                            label: name,
                            id: name,
                            value: name,
                            checked: featureStatus(name),
                        };
                    })}
                    onChange={this.setFeature}
                />
                <CheckboksPanelGruppe
                    legend="Mål tilstand"
                    checkboxes={[
                        {
                            label: 'Ingen mål',
                            id: LocalStorageElement.INGEN_MAL,
                            checked: ingenMal(),
                        },
                    ]}
                    onChange={this.endreTilstand}
                />
                <CheckboksPanelGruppe
                    legend="Feiltilstander"
                    checkboxes={[
                        {
                            label: 'Oppfølging feiler',
                            id: LocalStorageElement.OPPF_FEILET,
                            checked: oppfFeilet(),
                        },
                        {
                            label: 'Dialog feiler',
                            id: LocalStorageElement.DIALOG_FEILET,
                            checked: dialogFeilet(),
                        },
                        {
                            label: 'Aktivitet feiler',
                            id: LocalStorageElement.AKTIVITET_FEILET,
                            checked: aktivitetFeilet(),
                        },
                        {
                            label: 'Arena feiler',
                            id: LocalStorageElement.ARENA_FEILET,
                            checked: arenaFeilet(),
                        },
                        {
                            label: 'Mål feiler',
                            id: LocalStorageElement.MAAL_FEILET,
                            checked: maalFeilet(),
                        },
                        {
                            label: 'Kun oppdatering feiler',
                            id: LocalStorageElement.OPPDATERING_KUN_FEILER,
                            checked: oppdateringKunFeiler(),
                        },
                        {
                            label: 'Nivå 4 feiler',
                            id: LocalStorageElement.NIVAA4_FEILET,
                            checked: nivaa4Feilet(),
                        },
                    ]}
                    onChange={this.endreTilstand}
                />
            </section>
        );
    }
}

export default DemoDashboard;
