import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';

interface Props {
    disabled?: boolean;
    loading?: boolean;
}

const LagreAktivitetKnapp = (props: Props) => {
    const { disabled, loading = false } = props;
    const underOppfolging = useSelector(selectErUnderOppfolging);

    return (
        <>
            <Button className="mt-4" loading={loading} disabled={disabled || !underOppfolging || loading}>
                Lagre
            </Button>
        </>
    );
};

export default LagreAktivitetKnapp;
