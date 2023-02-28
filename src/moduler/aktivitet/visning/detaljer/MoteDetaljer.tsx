import React from 'react';
import { FormattedMessage } from 'react-intl';

import { MOTE_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoManed } from '../../../../utils';
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

    return (
        <>
            <Informasjonsfelt
                key="dato"
                tittel={<FormattedMessage id="aktivitetdetaljer.dato" />}
                innhold={formaterDatoManed(aktivitet.fraDato)}
            />
            <Informasjonsfelt
                key="klokkeslett"
                tittel={<FormattedMessage id="aktivitetdetaljer.klokkeslett" />}
                innhold={formatterKlokkeslett(moteTid.klokkeslett)}
            />
            <Informasjonsfelt
                key="kanal"
                tittel={<FormattedMessage id="aktivitetdetaljer.kanal" />}
                innhold={aktivitet.kanal && <FormattedMessage id={`kanal.${aktivitet.kanal}`.toLowerCase()} />}
            />
            <Informasjonsfelt
                key="varighet"
                tittel={<FormattedMessage id="aktivitetdetaljer.varighet" />}
                innhold={formatterVarighet(moteTid.varighet)}
            />
            <Informasjonsfelt
                key="adresse"
                tittel={<FormattedMessage id="aktivitetdetaljer.adresse" />}
                innhold={aktivitet.adresse}
                formattertTekst
                fullbredde
            />
            <Informasjonsfelt
                key="bakgrunn"
                tittel={<FormattedMessage id="aktivitetdetaljer.bakgrunn" />}
                innhold={aktivitet.beskrivelse}
                formattertTekst
                fullbredde
            />
            <Informasjonsfelt
                key="forberedelser"
                tittel={<FormattedMessage id="aktivitetdetaljer.forberedelser" />}
                innhold={aktivitet.forberedelser}
                formattertTekst
                fullbredde
            />
        </>
    );
};

export default MoteDetaljer;
