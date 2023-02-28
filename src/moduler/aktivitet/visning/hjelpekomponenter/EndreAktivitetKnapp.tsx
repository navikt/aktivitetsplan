import { Edit } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import loggEvent, { APNE_ENDRE_AKTIVITET } from '../../../../felles-komponenter/utils/logging';
import { endreAktivitetRoute } from '../../../../routes';

interface Props {
    id: string;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

const EndreAktivitetKnapp = (props: Props) => {
    const { id, tillatEndring, laster, underOppfolging } = props;

    if (!tillatEndring) {
        return null;
    }

    const history = useHistory();
    const goToEndre = () => {
        loggEvent(APNE_ENDRE_AKTIVITET);
        history.push(endreAktivitetRoute(id));
    };

    return (
        <Button
            disabled={laster || !underOppfolging}
            onClick={goToEndre}
            variant="secondary"
            icon={<Edit aria-hidden />}
        >
            Endre på aktiviteten
        </Button>
    );
};

export default EndreAktivitetKnapp;
