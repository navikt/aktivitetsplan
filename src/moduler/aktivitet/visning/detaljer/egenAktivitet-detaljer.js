import { FormattedMessage } from 'react-intl';
import React from 'react';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';
import { EGEN_AKTIVITET_TYPE } from '../../../../constant';
import LenkeKomponent from '../hjelpekomponenter/lenkekomponent';

const EgenAktivitetDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={aktivitet.type !== EGEN_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <Informasjonsfelt
                key="fradato"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.egen" />
                }
                innhold={formaterDatoKortManed(aktivitet.fraDato)}
            />
            <Informasjonsfelt
                key="tildato"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.egen" />
                }
                innhold={formaterDatoKortManed(aktivitet.tilDato)}
            />
            <Informasjonsfelt
                key="hensikt"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.hensikt-label" />
                }
                innhold={aktivitet.hensikt}
            />
            <Informasjonsfelt
                key="oppfolging"
                fullbredde
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.oppfolging-label" />
                }
                innhold={aktivitet.oppfolging}
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

EgenAktivitetDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default EgenAktivitetDetaljer;
