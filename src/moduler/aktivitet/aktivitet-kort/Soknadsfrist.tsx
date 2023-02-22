import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { StillingAktivitet } from '../../../datatypes/internAktivitetTypes';
import { dagerTil, formaterDatoKortManed } from '../../../utils';
import styles from './Aktivitetskort.module.less';

function getClassName(frist: number) {
    if (frist < 0) return styles.fristUtgaat;
    if (frist < 14) return styles.frist;

    return '';
}

function getTekst(frist: number, tilDato: string) {
    if (frist === 0) return 'Søknadsfristen går ut i dag';
    if (frist === 1) return 'Søknadsfristen går ut i morgen';
    if (frist > 14) return `Søknadsfrist: ${formaterDatoKortManed(tilDato)}`;
    if (frist < 0) return 'Søknadsfristen har gått ut';

    return `Søknadsfristen går ut om ${frist} dager`;
}

interface Props {
    aktivitet: StillingAktivitet;
}

function Soknadfrist({ aktivitet }: Props) {
    const { tilDato, etikett } = aktivitet;

    if (etikett || !tilDato) {
        return null;
    }

    const frist = dagerTil(tilDato);
    return <BodyShort className={getClassName(frist)}>{getTekst(frist, tilDato)}</BodyShort>;
}

export default Soknadfrist;
