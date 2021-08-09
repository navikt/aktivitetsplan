import { HoyreChevron } from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

import { StillingFraNavAktivitetData } from '../../../../datatypes/aktivitetTypes';
import { formatterLenke } from '../../../../utils/formatterLenke';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import styles from './AktivitetDetaljer.module.less';

type Props = {
    stillingFraNavData: StillingFraNavAktivitetData;
};

export const StillingFraNavDetaljer = ({ stillingFraNavData }: Props) => {
    if (!stillingFraNavData) return null;

    return (
        <>
            <div className={styles.detaljer}>
                <Informasjonsfelt key="arbeidsgiver" tittel="arbeidsgiver" innhold={stillingFraNavData.arbeidsgiver} />
                <Informasjonsfelt key="arbeidssted" tittel="arbeidssted" innhold={stillingFraNavData.arbeidssted} />
                <Informasjonsfelt
                    key="kontaktperson"
                    tittel="kontaktperson"
                    innhold={stillingFraNavData.kontaktperson}
                />
            </div>
            <Knapp onClick={() => window.open(formatterLenke(stillingFraNavData.lenke))} mini>
                Les mer om stillingen
                <HoyreChevron />
            </Knapp>
        </>
    );
};
