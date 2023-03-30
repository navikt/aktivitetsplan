import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    if (!tillatEndring) {
        return null;
    }

    const goToEndre = () => {
        loggEvent(APNE_ENDRE_AKTIVITET);
        navigate(endreAktivitetRoute(id));
    };

    return (
        <Button
            disabled={laster || !underOppfolging}
            onClick={goToEndre}
            variant="secondary"
            icon={<PencilIcon aria-hidden fontSize="1.5rem" />}
        >
            Endre på aktiviteten
        </Button>
    );
};

export default EndreAktivitetKnapp;
