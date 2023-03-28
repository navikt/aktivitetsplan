import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { STILLING_FRA_NAV_BASE_URL } from '../../../../constant';
import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { loggStillingFraNavStillingslenkeKlikk } from '../../../../felles-komponenter/utils/logging';
import { selectErVeileder } from '../../../identitet/identitet-selector';

interface Props {
    aktivitet: StillingFraNavAktivitet;
}

const LesMerOmStillingenKnapp = ({ aktivitet }: Props) => {
    const erVeileder = useSelector(selectErVeileder);
    const stillingslenke = `${STILLING_FRA_NAV_BASE_URL}${aktivitet.stillingFraNavData.stillingsId}`;

    return (
        <Button
            variant="secondary"
            as="a"
            href={stillingslenke}
            onClick={() => loggStillingFraNavStillingslenkeKlikk(erVeileder)}
            target="_blank"
        >
            Les mer om stillingen
        </Button>
    );
};

export default LesMerOmStillingenKnapp;
