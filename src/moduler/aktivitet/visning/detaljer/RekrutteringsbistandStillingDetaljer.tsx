import { HoyreChevron } from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

import { REKRUTTERINGSBISTAND_TYPE } from '../../../../constant';
import { RekrutteringsbistandAktivitet } from '../../../../datatypes/aktivitetTypes';
import { formatterLenke } from '../../../../utils/formatterLenke';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import styles from './AktivitetDetaljer.module.less';

type Props = {
    aktivitet: RekrutteringsbistandAktivitet;
};

export const RekrutteringsbistandStillingDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== REKRUTTERINGSBISTAND_TYPE) return null;
    return (
        <div className={styles.detaljer}>
            <Informasjonsfelt key="arbeidsgiver" tittel="arbeidsgiver" innhold={aktivitet.arbeidsgiver} />
            <Informasjonsfelt key="kontaktperson" tittel="kontaktperson" innhold={aktivitet.kontaktperson} />
            <Informasjonsfelt key="arbeidssted" tittel="arbeidssted" innhold={aktivitet.arbeidssted} />
            <Knapp onClick={() => window.open(formatterLenke(aktivitet.lenke))} mini>
                Les mer om stillingen
                <HoyreChevron />
            </Knapp>
        </div>
    );
};
