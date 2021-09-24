import { HoyreChevron } from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

import { StillingFraNavAktivitetData } from '../../../../datatypes/aktivitetTypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import styles from './AktivitetDetaljer.module.less';
import { KontaktInfoDetaljer } from './KontaktInfoDetaljer';

type Props = {
    stillingFraNavData: StillingFraNavAktivitetData;
};
const deafultBasePath = 'https://www.nav.no/arbeid/stilling/';
export const StillingFraNavDetaljer = ({ stillingFraNavData }: Props) => {
    if (!stillingFraNavData) return null;
    // @ts-ignore
    const basePath = window?.aktivitetsplan?.SITLING_FRA_NAV_BASE_URL
        ? window?.aktivitetsplan?.SITLING_FRA_NAV_BASE_URL
        : deafultBasePath;

    const url = basePath + stillingFraNavData.stillingsId;

    return (
        <>
            <div className={styles.detaljer}>
                <Informasjonsfelt key="arbeidsgiver" tittel="arbeidsgiver" innhold={stillingFraNavData.arbeidsgiver} />
                <Informasjonsfelt key="arbeidssted" tittel="arbeidssted" innhold={stillingFraNavData.arbeidssted} />
                <KontaktInfoDetaljer kontaktInfo={stillingFraNavData.kontaktpersonData} />
            </div>
            <Knapp onClick={() => window.open(url)} mini>
                Les mer om stillingen
                <HoyreChevron />
            </Knapp>
        </>
    );
};
