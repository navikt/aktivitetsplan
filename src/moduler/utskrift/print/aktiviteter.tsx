import { Systemtittel, Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../datatypes/dialogTypes';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { compareAktivitet } from '../../aktivitet/aktivitet-util';
import AvtaltMarkering from '../../aktivitet/avtalt-markering/AvtaltMarkering';
import SokeStatusEtikett from '../../aktivitet/etikett/SokeStatusEtikett';
import Aktivitetsdetaljer from '../../aktivitet/visning/hjelpekomponenter/aktivitetsdetaljer';
import Informasjonsfelt from '../../aktivitet/visning/hjelpekomponenter/Informasjonsfelt';
import { DialogPrint } from './dialoger';

const typeMap = {
    EGEN: 'Jobbrettet egenaktivitet',
    STILLING: 'Stilling',
    TILTAKSAKTIVITET: 'Tiltak gjennom NAV',
    GRUPPEAKTIVITET: 'Gruppeaktivitet',
    UTDANNINGSAKTIVITET: 'Utdanning',
    SOKEAVTALE: 'Jobbsøking',
    IJOBB: 'Jobb jeg har nå',
    BEHANDLING: 'Behandling',
    MOTE: 'Møte med NAV',
    SAMTALEREFERAT: 'Samtalereferat',
};

function AktivitetReferat(props: AktivitetProps) {
    const { referat, erReferatPublisert, historisk } = props.aktivitet;
    const harReferat = !!referat;
    const visReferat = erReferatPublisert && (harReferat || !historisk);

    return (
        <HiddenIfDiv hidden={!visReferat} className="printmodal-body__aktivitetreferat">
            <Informasjonsfelt key="referat" tittel="Samtalereferat" innhold={referat} formattertTekst />
        </HiddenIfDiv>
    );
}

interface AktivitetProps {
    aktivitet: Aktivitet;
    dialog?: Dialog;
}

function AktivitetPrint(props: AktivitetProps) {
    const { aktivitet, dialog } = props;
    const { id, type, tittel } = aktivitet;

    return (
        <div key={id} className="printmodal-body__statusgruppe">
            <p className="printmodal-body__statusgruppe--type">{typeMap[type]}</p>

            <Undertittel tag="h2" className="printmodal-body__statusgruppe--overskrift">
                {tittel}
            </Undertittel>

            <Aktivitetsdetaljer valgtAktivitet={aktivitet} key={id} />
            <AktivitetReferat aktivitet={aktivitet} />
            <AvtaltMarkering hidden={!aktivitet.avtalt} className="etikett-print" />
            <SokeStatusEtikett hidden={!aktivitet.etikett} etikett={aktivitet.etikett} className="etikett-print" />
            <DialogPrint dialog={dialog} />
        </div>
    );
}

interface GruppeProps {
    titel: string;
    aktiviteter?: Aktivitet[];
    dialoger?: Dialog[];
}

function Gruppe(props: GruppeProps) {
    const { titel, aktiviteter, dialoger } = props;

    if (!aktiviteter) return null;

    return (
        <section className="printmodal-body__statusgrupper">
            <Systemtittel tag="h1" className="printmodal-body__statusgruppe--overskrift">
                {titel}
            </Systemtittel>
            {aktiviteter.sort(compareAktivitet).map((aktivitet) => {
                const dialogForAktivitet = dialoger && dialoger.find((d) => d.aktivitetId === aktivitet.id);
                return <AktivitetPrint aktivitet={aktivitet} key={aktivitet.id} dialog={dialogForAktivitet} />;
            })}
        </section>
    );
}

interface Props {
    aktiviteter?: Aktivitet[];
    dialoger?: Dialog[];
}

function Aktiviteter(props: Props) {
    const { aktiviteter, dialoger } = props;

    if (!aktiviteter) {
        return null;
    }

    const gruperteAktiviteter = aktiviteter.reduce((acc: { [key: string]: Aktivitet[] | undefined }, a: Aktivitet) => {
        const status = acc[a.status];
        if (status) {
            status.push(a);
        } else {
            acc[a.status] = [a];
        }
        return acc;
    }, {});

    return (
        <>
            <Gruppe
                titel={'Aktiviteter jeg gjennomfører nå'}
                aktiviteter={gruperteAktiviteter[STATUS_GJENNOMFOERT]}
                dialoger={dialoger}
            />
            <Gruppe
                titel={'Planlagte aktiviteter'}
                aktiviteter={gruperteAktiviteter[STATUS_PLANLAGT]}
                dialoger={dialoger}
            />
            <Gruppe
                titel={'Forslag til aktiviteter'}
                aktiviteter={gruperteAktiviteter[STATUS_BRUKER_ER_INTRESSERT]}
                dialoger={dialoger}
            />
            <Gruppe
                titel={'Fullførte aktiviteter'}
                aktiviteter={gruperteAktiviteter[STATUS_FULLFOERT]}
                dialoger={dialoger}
            />
            <Gruppe
                titel={'Avbrutte aktiviteter'}
                aktiviteter={gruperteAktiviteter[STATUS_AVBRUTT]}
                dialoger={dialoger}
            />
        </>
    );
}

export default Aktiviteter;
