import React from 'react';
import PT from 'prop-types';
import FilterIkon from './filter-ikon';

function FiltreringLabel({ label, slettFilter }) {
    return (
        <button
            type="button"
            aria-label="slett-filter"
            className="filtreringlabel typo-undertekst"
            onClick={slettFilter}
        >
            <span className="filtreringlabel__label">{label}</span>
            <FilterIkon />
        </button>
    );
}

FiltreringLabel.propTypes = {
    label: PT.object.isRequired,
    slettFilter: PT.func.isRequired,
};

export default FiltreringLabel;
