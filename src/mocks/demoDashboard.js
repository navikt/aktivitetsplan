import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import {CheckboksPanelGruppe, RadioPanelGruppe} from 'nav-frontend-skjema';
import {
    SessionStorageElement,
    settSessionStorage,
    erEksternBruker,
    erPrivatBruker
} from "./sessionstorage";

const brukertype = {
    ekstern: 'eksternbruker',
    veileder: 'veilederbruker'

};

class DemoDashboard extends React.Component {

    endreTilstand = (e) => {
        const element = e.currentTarget;

        if(element.id === SessionStorageElement.PRIVAT_BRUKER){
            settSessionStorage(SessionStorageElement.PRIVAT_BRUKER, element.checked);
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
       if(erEksternBruker()) {
           return brukertype.ekstern;
       }
       else return brukertype.veileder;
    };

    render() {
        return (
            <section className="demodashboard">
                <Innholdstittel className="blokk-s">
                    DEMO
                </Innholdstittel>
                <RadioPanelGruppe
                    legend="Brukertype"
                    name="brukertype-rdio-panel"
                    radios={[
                        { label: 'Veileder', id: brukertype.veileder, value: brukertype.veileder },
                        { label: 'Eksternbruker', id: brukertype.ekstern, value: brukertype.ekstern }
                    ]}
                    checked={this.getBrukerType()}
                    onChange={this.endreBrukerType}
                />
                <CheckboksPanelGruppe
                    legend="Tilstand"
                    checkboxes={[
                        {
                            label: 'Ikke under oppfølging',
                            id: SessionStorageElement.PRIVAT_BRUKER,
                            checked: erPrivatBruker()
                        }
                    ]}
                    onChange={this.endreTilstand}
                />
            </section>
        )
    }
}

export default DemoDashboard;
