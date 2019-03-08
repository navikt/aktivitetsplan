import { FormattedMessage } from 'react-intl';
import React from 'react';
import { IJOBB_AKTIVITET_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';

const IJobbDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={aktivitet.type !== IJOBB_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <Informasjonsfelt
                key="fradato"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.default" />
                }
                innhold={formaterDatoKortManed(aktivitet.fraDato)}
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
                key="jobbstatus"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.jobbStatus-label" />
                }
                innhold={
                    <FormattedMessage
                        id={`aktivitetdetaljer.jobbStatus-${aktivitet.jobbStatus}`}
                    />
                }
            />
            <Informasjonsfelt
                key="ansettelsesforhold"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.ansettelsesforhold-label" />
                }
                innhold={aktivitet.ansettelsesforhold}
            />
            <Informasjonsfelt
                key="arbeidstid"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.arbeidstid-label" />
                }
                innhold={aktivitet.arbeidstid}
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

IJobbDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default IJobbDetaljer;
