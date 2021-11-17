import { HoyreChevron } from 'nav-frontend-chevron';
import React from 'react';
import { useSelector } from 'react-redux';

import { StillingFraNavAktivitetData } from '../../../../datatypes/aktivitetTypes';
import { loggStillingFraNavStillingslenkeKlikk } from '../../../../felles-komponenter/utils/logging';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import styles from './AktivitetDetaljer.module.less';

type Props = {
    stillingFraNavData: StillingFraNavAktivitetData;
};
const deafultBasePath = 'https://www.nav.no/arbeid/stilling/';
/* eslint-disable react/jsx-no-target-blank */
export const StillingFraNavDetaljer = ({ stillingFraNavData }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    if (!stillingFraNavData) return null;
    // @ts-ignore
    const envBasePath = window?.aktivitetsplan?.STILLING_FRA_NAV_BASE_URL;
    const basePath = envBasePath ? envBasePath : deafultBasePath;

    const url = basePath + stillingFraNavData.stillingsId;

    return (
        <>
            <div className={styles.detaljer}>
                <Informasjonsfelt key="arbeidsgiver" tittel="arbeidsgiver" innhold={stillingFraNavData.arbeidsgiver} />
                <Informasjonsfelt key="arbeidssted" tittel="arbeidssted" innhold={stillingFraNavData.arbeidssted} />
            </div>
            <a
                href={url}
                className="knapp knapp--mini"
                target="_blank"
                onClick={() => loggStillingFraNavStillingslenkeKlikk(erVeileder)}
            >
                Les mer om stillingen
                <HoyreChevron />
            </a>
        </>
    );
};
