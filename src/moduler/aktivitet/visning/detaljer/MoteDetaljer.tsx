import React from 'react';

import { MOTE_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoManed } from '../../../../utils/dateUtils';
import { kanalMap } from '../../../../utils/textMappers';
import { beregnKlokkeslettVarighet, formatterKlokkeslett, formatterVarighet } from '../../aktivitet-util';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const MoteDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== MOTE_TYPE) {
        return null;
    }

    const moteTid = beregnKlokkeslettVarighet(aktivitet);
    console.log('Mote: ', aktivitet.fraDato);
    console.log('Mote: ', aktivitet.adresse);
    console.log('Formattert:', formatterKlokkeslett(moteTid?.klokkeslett));

    return (
        <>
            <Informasjonsfelt key="dato" tittel="Dato" innhold={formaterDatoManed(aktivitet.fraDato)} />
            <Informasjonsfelt
                key="klokkeslett"
                tittel="Klokkeslett"
                innhold={formatterKlokkeslett(moteTid?.klokkeslett)}
            />
            <Informasjonsfelt key="kanal" tittel="Møteform" innhold={aktivitet.kanal && kanalMap[aktivitet.kanal]} />
            <Informasjonsfelt key="varighet" tittel="Varighet" innhold={formatterVarighet(moteTid?.varighet)} />
            <Informasjonsfelt
                key="adresse"
                tittel="Møtested eller annen praktisk informasjon"
                innhold={aktivitet.adresse}
                formattertTekst
                fullbredde
            />
            <Informasjonsfelt
                key="bakgrunn"
                tittel="Hensikt med møtet"
                innhold={aktivitet.beskrivelse}
                formattertTekst
                fullbredde
            />
            <Informasjonsfelt
                key="forberedelser"
                tittel="Forberedelser til møtet"
                innhold={aktivitet.forberedelser}
                formattertTekst
                fullbredde
            />
        </>
    );
};

export default MoteDetaljer;
