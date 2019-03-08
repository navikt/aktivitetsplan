import { FormattedMessage } from 'react-intl';
import React from 'react';
import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';

const BehandlingsDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={BEHANDLING_AKTIVITET_TYPE !== aktivitet.type}>
        <div className="aktivitetvisning__detaljer">
            <Informasjonsfelt
                key="behandlingtype"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.behandling-type-label" />
                }
                innhold={aktivitet.behandlingType}
            />
            <Informasjonsfelt
                key="behandlingsted"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.behandling-sted-label" />
                }
                innhold={aktivitet.behandlingSted}
            />
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
                innhold={formaterDatoKortManed(aktivitet.tilDato)}
            />
            <Informasjonsfelt
                key="effekt"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.effekt-label" />
                }
                innhold={aktivitet.effekt}
            />
            <Informasjonsfelt
                key="behandlingOppfolging"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.behandling-oppfolging-label" />
                }
                innhold={aktivitet.behandlingOppfolging}
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

BehandlingsDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default BehandlingsDetaljer;
