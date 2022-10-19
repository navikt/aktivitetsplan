import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import * as AppPT from '../../../../proptypes';
import { formaterDatoManed } from '../../../../utils';
import Informasjonsfelt, { HiddenIfInformasjonsfelt } from './Informasjonsfelt';

const formatertDato = (dato: string | undefined, visIkkeSatt: boolean) => {
    if (visIkkeSatt && !dato) {
        return 'Dato ikke satt';
    }
    return formaterDatoManed(dato);
};

interface Props {
    aktivitet: AlleAktiviteter;
    tittel: string;
    visIkkeSatt: boolean;
    hidden: boolean;
}

export const FraDato = ({ aktivitet, tittel, visIkkeSatt, hidden }: Props) => (
    <HiddenIfInformasjonsfelt
        key="fradato"
        tittel={tittel}
        innhold={formatertDato(aktivitet.fraDato, visIkkeSatt)}
        hidden={hidden}
    />
);

FraDato.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    tittel: PT.node,
    visIkkeSatt: PT.bool,
    hidden: PT.bool,
};

FraDato.defaultProps = {
    tittel: <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.default" />,
    visIkkeSatt: false,
    hidden: false,
};

export const TilDato = ({ aktivitet, tittel, visIkkeSatt, hidden }: Props) => (
    <HiddenIfInformasjonsfelt
        key="tildato"
        tittel={tittel}
        innhold={formatertDato(aktivitet.tilDato, visIkkeSatt)}
        hidden={hidden}
    />
);

TilDato.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    tittel: PT.node,
    visIkkeSatt: PT.bool,
    hidden: PT.bool,
};

TilDato.defaultProps = {
    tittel: <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.default" />,
    visIkkeSatt: false,
    hidden: false,
};

export const Beskrivelse = ({ aktivitet }: { aktivitet: AlleAktiviteter }) => (
    <Informasjonsfelt
        tittel={<FormattedMessage id="aktivitetvisning.beskrivelse-label" />}
        innhold={aktivitet.beskrivelse}
        beskrivelse
        fullbredde
        formattertTekst
    />
);

Beskrivelse.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};
