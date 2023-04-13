import { Button } from '@navikt/ds-react';
import React from 'react';

import { STILLING_FRA_NAV_BASE_URL } from '../../../../constant';
import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { loggStillingFraNavStillingslenkeKlikk } from '../../../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../../../Provider';

interface Props {
    aktivitet: StillingFraNavAktivitet;
}

const LesMerOmStillingenKnapp = ({ aktivitet }: Props) => {
    const erVeileder = useErVeileder();
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
