import { FormattedMessage } from 'react-intl';
import React from 'react';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';
import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import LenkeKomponent from '../hjelpekomponenter/lenkekomponent';

const StillingDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={aktivitet.type !== STILLING_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <Informasjonsfelt
                key="fradato"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.stilling" />
                }
                innhold={formaterDatoKortManed(aktivitet.fraDato)}
            />
            <Informasjonsfelt
                key="arbeidsgiver"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.arbeidsgiver-label" />
                }
                innhold={aktivitet.arbeidsgiver}
            />
            <Informasjonsfelt
                key="tildato"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.stilling" />
                }
                innhold={formaterDatoKortManed(aktivitet.tilDato)}
            />
            <Informasjonsfelt
                key="arbeidssted"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.arbeidssted-label" />
                }
                innhold={aktivitet.arbeidssted}
            />
            <Informasjonsfelt
                key="kontaktperson"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.kontaktperson-label" />
                }
                innhold={aktivitet.kontaktperson}
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
            <LenkeKomponent lenke={aktivitet.lenke} />
        </div>
    </HiddenIf>;

StillingDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default StillingDetaljer;
