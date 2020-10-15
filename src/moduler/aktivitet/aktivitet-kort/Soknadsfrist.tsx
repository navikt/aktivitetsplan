import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterDatoKortManed, dagerTil } from '../../../utils';
import styles from './Aktivitetskort.module.less';
import { Aktivitet } from '../../../types';

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
    aktivitet: Aktivitet;
}

function Soknadfrist({ aktivitet }: Props) {
    const { tilDato, etikett } = aktivitet;

    if (etikett || !tilDato) {
        return null;
    }

    const frist = dagerTil(tilDato);
    return <Normaltekst className={getClassName(frist)}>{getTekst(frist, tilDato)}</Normaltekst>;
}

export default Soknadfrist;
