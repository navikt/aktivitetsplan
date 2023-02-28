import React from 'react';

import { STILLING_FRA_NAV_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';

type Props = {
    aktivitet: AlleAktiviteter;
};

export const StillingFraNavDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== STILLING_FRA_NAV_TYPE) {
        return null;
    }

    const stillingFraNavData = aktivitet.stillingFraNavData;

    return (
        <div className="flex flex-row flex-wrap w-full gap-y-3">
            <Informasjonsfelt key="arbeidsgiver" tittel="Arbeidsgiver" innhold={stillingFraNavData.arbeidsgiver} />
            <Informasjonsfelt key="arbeidssted" tittel="Arbeidssted" innhold={stillingFraNavData.arbeidssted} />
        </div>
    );
};
