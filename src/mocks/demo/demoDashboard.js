import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { CheckboksPanelGruppe, RadioPanelGruppe } from 'nav-frontend-skjema';
import {
    SessionStorageElement,
    settSessionStorage,
    erEksternBruker,
    erPrivatBruker,
    ingenOppfPerioder,
    visAutomatiskeAktiviteter,
    visArenaAktiviteter,
    visTestAktiviteter,
    setFeatureTogle,
    fetureStatus,
    erManuellBruker,
    erKRRBruker,
    erEskalertBruker,
    oppfFeilet,
    ingenMal,
    ulesteDialoger,
    dialogFeilet,
    aktivitetFeilet,
    arenaFeilet,
    maalFeilet,
} from './sessionstorage';
import './demoDashboard.less';
import Hurtigfilter from './hurtigfilter';
import { ALL_FEATURES } from '../../felles-komponenter/feature/feature';

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
        const saveInSessionStorage = Object.values(SessionStorageElement).indexOf(checkbox.id) > -1;

        if (saveInSessionStorage) {
            settSessionStorage(checkbox.id, checkbox.checked);
            window.location.reload();
        }
    };

    endreBrukerType = (e) => {
        const element = e.currentTarget;
        const erVeileder = element.id === brukertype.veileder;

        settSessionStorage(SessionStorageElement.EKSTERN_BRUKER, !erVeileder);
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
                            id: SessionStorageElement.PRIVAT_BRUKER,
                            checked: erPrivatBruker(),
                        },
                        {
                            label: 'Manuell',
                            id: SessionStorageElement.MANUELL_BRUKER,
                            checked: erManuellBruker(),
                        },
                        {
                            label: 'KRR',
                            id: SessionStorageElement.KRR_BRUKER,
                            checked: erKRRBruker(),
                        },
                        {
                            label: 'Ingen oppfølgingsperioder',
                            id: SessionStorageElement.INGEN_OPPF_PERIODER,
                            checked: ingenOppfPerioder(),
                        },
                        {
                            label: 'Eskaleringsvarsel',
                            id: SessionStorageElement.ESKALERT_BRUKER,
                            checked: erEskalertBruker(),
                        },
                        {
                            label: 'Uleste dialoger',
                            id: SessionStorageElement.ULESTE_DIALOGER,
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
                            id: SessionStorageElement.AUTOMATISKE_AKTIVITETER,
                            checked: visAutomatiskeAktiviteter(),
                        },
                        {
                            label: 'Arenaaktiviteter',
                            id: SessionStorageElement.ARENA_AKTIVITETER,
                            checked: visArenaAktiviteter(),
                        },
                        {
                            label: 'Testaktiviteter',
                            id: SessionStorageElement.TEST_AKTIVITETER,
                            checked: visTestAktiviteter(),
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
                            checked: fetureStatus(name),
                        };
                    })}
                    onChange={this.setFeature}
                />
                <CheckboksPanelGruppe
                    legend="Mål tilstand"
                    checkboxes={[
                        {
                            label: 'Ingen mål',
                            id: SessionStorageElement.INGEN_MAL,
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
                            id: SessionStorageElement.OPPF_FEILET,
                            checked: oppfFeilet(),
                        },
                        {
                            label: 'Dialog feiler',
                            id: SessionStorageElement.DIALOG_FEILET,
                            checked: dialogFeilet(),
                        },
                        {
                            label: 'Aktivitet feiler',
                            id: SessionStorageElement.AKTIVITET_FEILET,
                            checked: aktivitetFeilet(),
                        },
                        {
                            label: 'Arena feiler',
                            id: SessionStorageElement.ARENA_FEILET,
                            checked: arenaFeilet(),
                        },
                        {
                            label: 'Mål feiler',
                            id: SessionStorageElement.MAAL_FEILET,
                            checked: maalFeilet(),
                        },
                    ]}
                    onChange={this.endreTilstand}
                />
            </section>
        );
    }
}

export default DemoDashboard;
