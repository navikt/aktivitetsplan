import { HoyreChevron } from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

import { STILLING_FRA_NAV_TYPE } from '../../../../constant';
import { StillingFraNavAktivitet } from '../../../../datatypes/aktivitetTypes';
import { formatterLenke } from '../../../../utils/formatterLenke';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import styles from './AktivitetDetaljer.module.less';

type Props = {
    aktivitet: StillingFraNavAktivitet;
};

export const StillingFraNavDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== STILLING_FRA_NAV_TYPE) return null;

    return (
        <>
            <div className={styles.detaljer}>
                <Informasjonsfelt key="arbeidsgiver" tittel="arbeidsgiver" innhold={aktivitet.arbeidsgiver} />
                <Informasjonsfelt key="arbeidssted" tittel="arbeidssted" innhold={aktivitet.arbeidssted} />
                <Informasjonsfelt key="kontaktperson" tittel="kontaktperson" innhold={aktivitet.kontaktperson} />
            </div>
            <Knapp onClick={() => window.open(formatterLenke(aktivitet.lenke))} mini>
                Les mer om stillingen
                <HoyreChevron />
            </Knapp>
        </>
    );
};
