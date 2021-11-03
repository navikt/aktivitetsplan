import { Close } from '@navikt/ds-icons';
import React from 'react';

interface Props {
    label: string;
    slettFilter(): void;
}

const FiltreringLabel = ({ label, slettFilter }: Props) => (
    <button type="button" aria-label="slett-filter" className="filtreringlabel typo-undertekst" onClick={slettFilter}>
        <span className="filtreringlabel__label">{label}</span>
        <Close className="filter-ikon-x-svg" aria-label="Lukk filter ikon" role="img" focusable="false" />
    </button>
);

export default FiltreringLabel;
