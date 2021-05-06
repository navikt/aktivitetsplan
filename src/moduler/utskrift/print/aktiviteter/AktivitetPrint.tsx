import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import AvtaltMarkering from '../../../aktivitet/avtalt-markering/AvtaltMarkering';
import SokeStatusEtikett from '../../../aktivitet/etikett/SokeStatusEtikett';
import Aktivitetsdetaljer from '../../../aktivitet/visning/hjelpekomponenter/aktivitetsdetaljer';
import { DialogPrint } from '../dialoger';
import AktivitetReferat from './AktivitetReferat';
import ForhaandsorienteringPrint from './ForhaandsorienteringPrint';

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

interface Props {
    aktivitet: Aktivitet;
    dialog?: Dialog;
}

const AktivitetPrint = (props: Props) => {
    const { aktivitet, dialog } = props;
    const { id, type, tittel } = aktivitet;
    const forhaandsorientering = aktivitet.forhaandsorientering;

    return (
        <div key={id} className="printmodal-body__statusgruppe">
            <p className="printmodal-body__statusgruppe--type">{typeMap[type]}</p>
            <Undertittel tag="h2" className="printmodal-body__statusgruppe--overskrift">
                {tittel}
            </Undertittel>
            <Aktivitetsdetaljer valgtAktivitet={aktivitet} key={id} />
            <AktivitetReferat aktivitet={aktivitet} />
            <AvtaltMarkering hidden={!aktivitet.avtalt} className="etikett-print" />
            <ForhaandsorienteringPrint
                forhaandsorienteringTekst={forhaandsorientering?.tekst}
                forhaandsorienteringLest={forhaandsorientering?.lest}
            />
            <SokeStatusEtikett hidden={!aktivitet.etikett} etikett={aktivitet.etikett} className="etikett-print" />
            <DialogPrint dialog={dialog} />
        </div>
    );
};

export default AktivitetPrint;
