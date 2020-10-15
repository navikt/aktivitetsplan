import { FormattedMessage } from 'react-intl';
import React from 'react';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { HiddenIf } from '../../../../utils';
import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import DetaljvisningLenke from '../hjelpekomponenter/detaljvisning-lenke';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const StillingDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={aktivitet.type !== STILLING_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <FraDato
                aktivitet={aktivitet}
                tittel={<FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.stilling" />}
            />
            <TilDato
                tittel={<FormattedMessage id="aktivitetdetaljer.til-dato-tekst.stilling" />}
                aktivitet={aktivitet}
                visIkkeSatt
            />
            <Informasjonsfelt
                key="arbeidsgiver"
                tittel={<FormattedMessage id="aktivitetdetaljer.arbeidsgiver-label" />}
                innhold={aktivitet.arbeidsgiver}
            />
            <Informasjonsfelt
                key="kontaktperson"
                tittel={<FormattedMessage id="aktivitetdetaljer.kontaktperson-label" />}
                innhold={aktivitet.kontaktperson}
            />
            <Informasjonsfelt
                key="arbeidssted"
                tittel={<FormattedMessage id="aktivitetdetaljer.arbeidssted-label" />}
                innhold={aktivitet.arbeidssted}
            />
            <Beskrivelse aktivitet={aktivitet} />
            <DetaljvisningLenke lenke={aktivitet.lenke} />
        </div>
    </HiddenIf>
);

StillingDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default StillingDetaljer;
