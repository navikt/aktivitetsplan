import React from 'react';
import { FormattedMessage } from 'react-intl';

import { EGEN_AKTIVITET_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { HiddenIf } from '../../../../utils';
import DetaljvisningLenke from '../hjelpekomponenter/detaljvisning-lenke';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const EgenAktivitetDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={aktivitet.type !== EGEN_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <FraDato aktivitet={aktivitet} tittel={<FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.egen" />} />
            <TilDato aktivitet={aktivitet} tittel={<FormattedMessage id="aktivitetdetaljer.til-dato-tekst.egen" />} />
            <Informasjonsfelt
                key="hensikt"
                fullbredde
                tittel={<FormattedMessage id="aktivitetdetaljer.hensikt-label" />}
                innhold={aktivitet.hensikt}
            />
            <Informasjonsfelt
                key="oppfolging"
                fullbredde
                tittel={<FormattedMessage id="aktivitetdetaljer.oppfolging-label" />}
                innhold={aktivitet.oppfolging}
            />
            <Beskrivelse aktivitet={aktivitet} />
            <DetaljvisningLenke lenke={aktivitet.lenke} />
        </div>
    </HiddenIf>
);

EgenAktivitetDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default EgenAktivitetDetaljer;
