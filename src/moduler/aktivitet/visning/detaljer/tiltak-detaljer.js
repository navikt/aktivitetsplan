import { FormattedMessage } from 'react-intl';
import React from 'react';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';
import * as AppPT from '../../../../proptypes';
import { TILTAK_AKTIVITET_TYPE } from '../../../../constant';

const TiltakDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={aktivitet.type !== TILTAK_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <Informasjonsfelt
                key="fradato"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.default" />
                }
                innhold={
                    formaterDatoKortManed(aktivitet.fraDato) || 'Dato ikke satt'
                }
            />
            <Informasjonsfelt
                key="tildato"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.default" />
                }
                innhold={
                    formaterDatoKortManed(aktivitet.tilDato) || 'Dato ikke satt'
                }
            />
            <Informasjonsfelt
                key="arrangoer"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.aarrangor-label" />
                }
                innhold={aktivitet.arrangoer}
            />
            <Informasjonsfelt
                key="deltakelsesprosent"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.deltakelsesprosent-label" />
                }
                innhold={
                    aktivitet.deltakelseProsent &&
                    `${aktivitet.deltakelseProsent}%`
                }
            />
            <Informasjonsfelt
                key="dagerPerUke"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.antall-dager-per-uke-label" />
                }
                innhold={
                    aktivitet.antallDagerPerUke &&
                    `${aktivitet.antallDagerPerUke}`
                }
            />
            <Informasjonsfelt
                tittel={
                    <FormattedMessage id="aktivitetvisning.beskrivelse-label" />
                }
                innhold={aktivitet.beskrivelse}
                beskrivelse
                fullbredde
                formattertTekst
            />
        </div>
    </HiddenIf>;

TiltakDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default TiltakDetaljer;
