import { FormattedMessage } from 'react-intl';
import React from 'react';
import { beregnKlokkeslettVarighet, formatterKlokkeslett, formatterVarighet } from '../../aktivitet-util';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';
import { MOTE_TYPE } from '../../../../constant';

const MoteDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={aktivitet.type !== MOTE_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <Informasjonsfelt
                key="dato"
                tittel={<FormattedMessage id="aktivitetdetaljer.dato" />}
                innhold={formaterDatoKortManed(aktivitet.fraDato)}
            />
            <Informasjonsfelt
                key="klokkeslett"
                tittel={<FormattedMessage id="aktivitetdetaljer.klokkeslett" />}
                innhold={formatterKlokkeslett(beregnKlokkeslettVarighet(aktivitet).klokkeslett)}
            />
            <Informasjonsfelt
                key="kanal"
                tittel={<FormattedMessage id="aktivitetdetaljer.kanal" />}
                innhold={aktivitet.kanal && <FormattedMessage id={`kanal.${aktivitet.kanal}`.toLowerCase()} />}
            />
            <Informasjonsfelt
                key="varighet"
                tittel={<FormattedMessage id="aktivitetdetaljer.varighet" />}
                innhold={formatterVarighet(beregnKlokkeslettVarighet(aktivitet).varighet)}
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
        </div>
    </HiddenIf>
);

MoteDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default MoteDetaljer;
