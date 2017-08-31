import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { selectFilterReducer } from './filter/filter-selector';
import FilterGruppe from './filter-gruppe';

function VisaValgtFilter({ filterSlice }) {
    return (
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

VisaValgtFilter.propTypes = {
    filterSlice: PT.object.isRequired,
};

const mapStateToProps = state => ({
    filterSlice: selectFilterReducer(state),
});

export default connect(mapStateToProps)(VisaValgtFilter);
