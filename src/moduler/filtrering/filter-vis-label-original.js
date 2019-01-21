import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { selectFilterSlice } from './filter/filter-selector';
import FilterGruppe from './filter-gruppe';
import {
    harFeature,
    VERKTOYLINJE,
} from '../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';

function VisaValgtFilter({ filterSlice, harNyVerktoylinje }) {
    let FilterElement = null;
    if (!harNyVerktoylinje) {
        FilterElement = (
            <div className="filtrering-label-container">
                {Object.keys(filterSlice).map(filterKey =>
                    <FilterGruppe
                        key={filterKey}
                        filterKey={filterKey}
                        filterValue={filterSlice[filterKey]}
                    />
                )}
            </div>
        );
    }
    return FilterElement;
}

VisaValgtFilter.propTypes = {
    filterSlice: PT.object.isRequired,
    harNyVerktoylinje: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const harNyVerktoylinje = harFeature(
        VERKTOYLINJE,
        selectFeatureData(state)
    );
    return {
        harNyVerktoylinje,
        filterSlice: selectFilterSlice(state),
    };
};

export default connect(mapStateToProps)(VisaValgtFilter);
