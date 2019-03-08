import { FormattedMessage } from 'react-intl';
import React from 'react';
import Informasjonsfelt, {
    HiddenIfInformasjonsfelt,
} from '../hjelpekomponenter/Informasjonsfelt';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';
import * as AppPT from '../../../../proptypes';

const SokeDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={aktivitet.type !== SOKEAVTALE_AKTIVITET_TYPE}>
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
                innhold={formaterDatoKortManed(aktivitet.tilDato)}
            />
            <HiddenIfInformasjonsfelt
                key="antallStillinger"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.antall-label" />
                }
                innhold={`${aktivitet.antallStillingerSokes}`}
                hidden={aktivitet.antallStillingerSokes < 1}
            />
            <HiddenIfInformasjonsfelt
                key="avtaleOppfolging"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.avtale-oppfolging-label" />
                }
                beskrivelse
                formattertTekst
                hiden={!aktivitet.avtaleOppfolging}
                innhold={aktivitet.avtaleOppfolging}
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

SokeDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default SokeDetaljer;
