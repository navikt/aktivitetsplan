import { Chips } from '@navikt/ds-react';
import React, { ReactNode } from 'react';

interface Props {
    label: ReactNode;
    slettFilter(): void;
}

const FiltreringLabel = ({ label, slettFilter }: Props) => (
    <Chips.Removable variant="neutral" aria-label="slett-filter" onClick={slettFilter}>
        {label as any}
    </Chips.Removable>
);

export default FiltreringLabel;
