import { HoyreChevron } from 'nav-frontend-chevron';
import React from 'react';
import { useSelector } from 'react-redux';

import { StillingFraNavAktivitetData } from '../../../../datatypes/internAktivitetTypes';
import { loggStillingFraNavStillingslenkeKlikk } from '../../../../felles-komponenter/utils/logging';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import styles from './AktivitetDetaljer.module.less';

type Props = {
    stillingFraNavData: StillingFraNavAktivitetData;
};
/* eslint-disable react/jsx-no-target-blank */
export const StillingFraNavDetaljer = ({ stillingFraNavData }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    if (!stillingFraNavData) return null;

    const url = process.env.REACT_APP_STILLING_FRA_NAV_BASE_URL + stillingFraNavData.stillingsId;

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
