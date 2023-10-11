import React, { ReactNode } from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoManed } from '../../../../utils/dateUtils';
import Informasjonsfelt from './Informasjonsfelt';

const formatertDato = (dato: string | undefined, visIkkeSatt?: boolean) => {
    if (!visIkkeSatt && !dato) {
        return 'Dato ikke satt';
    }
    return formaterDatoManed(dato);
};

interface DatoFeltProps {
    aktivitet: AlleAktiviteter;
    tittel?: ReactNode;
    visIkkeSatt?: boolean;
}

export const FraDato = ({ aktivitet, tittel, visIkkeSatt }: DatoFeltProps) => (
    <Informasjonsfelt
        key="fradato"
        tittel={tittel || 'Fra dato'}
        innhold={formatertDato(aktivitet.fraDato, visIkkeSatt)}
    />
);

export const TilDato = ({ aktivitet, tittel, visIkkeSatt }: DatoFeltProps) => (
    <Informasjonsfelt
        key="tildato"
        tittel={tittel || 'Til dato'}
        innhold={formatertDato(aktivitet.tilDato, visIkkeSatt)}
    />
);

interface BeskrivelseFeltProps {
    aktivitet: AlleAktiviteter;
}

export const Beskrivelse = ({ aktivitet }: BeskrivelseFeltProps) => (
    <Informasjonsfelt tittel="Beskrivelse" innhold={aktivitet.beskrivelse} beskrivelse fullbredde formattertTekst />
);
