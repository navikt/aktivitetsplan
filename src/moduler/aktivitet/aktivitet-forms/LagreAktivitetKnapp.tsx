import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { STATUS } from '../../../api/utils';
import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';

interface Props {
    disabled?: boolean;
}

const LagreAktivitetKnapp = ({ disabled }: Props) => {
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const status = useSelector(selectAktivitetStatus);
    const venter = !(status === STATUS.OK || status === STATUS.ERROR);

    return (
        <Button className="mt-4" loading={venter} disabled={disabled || venter || !underOppfolging}>
            Lagre
        </Button>
    );
};

export default LagreAktivitetKnapp;
