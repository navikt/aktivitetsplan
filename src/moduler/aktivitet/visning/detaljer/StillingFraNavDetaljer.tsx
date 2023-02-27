import { Next } from '@navikt/ds-icons';
import React from 'react';
import { useSelector } from 'react-redux';

import { STILLING_FRA_NAV_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { loggStillingFraNavStillingslenkeKlikk } from '../../../../felles-komponenter/utils/logging';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';

type Props = {
    aktivitet: AlleAktiviteter;
};

export const StillingFraNavDetaljer = ({ aktivitet }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    if (aktivitet.type !== STILLING_FRA_NAV_TYPE) {
        return null;
    }

    const stillingFraNavData = aktivitet.stillingFraNavData;

    const url = process.env.REACT_APP_STILLING_FRA_NAV_BASE_URL + stillingFraNavData.stillingsId;

    return (
        <>
            <div className="flex flex-row flex-wrap w-full gap-y-3">
                <Informasjonsfelt key="arbeidsgiver" tittel="Arbeidsgiver" innhold={stillingFraNavData.arbeidsgiver} />
                <Informasjonsfelt key="arbeidssted" tittel="Arbeidssted" innhold={stillingFraNavData.arbeidssted} />
            </div>
            <a
                href={url}
                className="mt-4"
                target="_blank"
                onClick={() => loggStillingFraNavStillingslenkeKlikk(erVeileder)}
            >
                Les mer om stillingen
                <Next className="inline" />
            </a>
        </>
    );
};
