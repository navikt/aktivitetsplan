import { FormattedMessage } from 'react-intl';
import React from 'react';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';
import { UTDANNING_AKTIVITET_TYPE } from '../../../../constant';

const UtdanningDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={aktivitet.type !== UTDANNING_AKTIVITET_TYPE}>
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

UtdanningDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default UtdanningDetaljer;
