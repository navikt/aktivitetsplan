import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import {
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    velgHistoriskPeriode,
} from './filter/filter-reducer';
import { selectFilterSlice } from './filter/filter-selector';
import { PeriodeLabel } from './filter/periode-filter';
import FiltreringLabel from './filteringslabel/filtering-label';

function VisValgtFilter(props) {
    const {
        filterSlice,
        doToggleAktivitetsEtikett,
        doToggleAktivitetsStatus,
        doToggleAktivitetsType,
        doVelgHistoriskPeriode,
        doToggleAktivitetAvtaltMedNav,
        className,
    } = props;
    const setFilterValues = (filterType, filterVerdi) => {
        switch (filterType) {
            case 'aktivitetTyper':
                return {
                    tekstPath: `aktivitet.type.${filterVerdi}`,
                    func: doToggleAktivitetsType,
                };
            case 'aktivitetEtiketter':
                return {
                    tekstPath: `aktivitet.etikett.${filterVerdi}`,
                    func: doToggleAktivitetsEtikett,
                };
            case 'aktivitetStatus':
                return {
                    tekstPath: `aktivitet.status.${filterVerdi}`,
                    func: doToggleAktivitetsStatus,
                };
            case 'aktivitetAvtaltMedNav':
                return {
                    tekstPath: `aktivitet.${filterVerdi}`,
                    func: doToggleAktivitetAvtaltMedNav,
                };
            default:
                return filterType;
        }
    };
    return (
        <div className={classNames('filtrering-label-container', className)}>
            {Object.keys(filterSlice).map((filterKey) => {
                const filterValue = filterSlice[filterKey];

                if (filterKey === 'historiskPeriode') {
                    if (!filterValue) {
                        return null;
                    }
                    return (
                        <FiltreringLabel
                            key={filterValue}
                            label={<PeriodeLabel historiskPeriode={filterValue} />}
                            slettFilter={() => doVelgHistoriskPeriode(null)}
                        />
                    );
                }

                return Object.keys(filterSlice[filterKey])
                    .filter((f) => filterValue[f])
                    .map((f) => {
                        const filterValues = setFilterValues(filterKey, f);
                        return (
                            <FiltreringLabel
                                key={f}
                                label={<FormattedMessage id={filterValues.tekstPath.toLowerCase()} />}
                                slettFilter={() => {
                                    filterValues.func(f);
                                }}
                            />
                        );
                    });
            })}
        </div>
    );
}

VisValgtFilter.defaultProps = {
    className: '',
};

VisValgtFilter.propTypes = {
    filterSlice: PT.object.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
    doVelgHistoriskPeriode: PT.func.isRequired,
    doToggleAktivitetAvtaltMedNav: PT.func.isRequired,
    className: PT.string,
};

const mapStateToProps = (state) => ({
    filterSlice: selectFilterSlice(state),
});

const mapDispatchToProps = (dispatch) => ({
    doToggleAktivitetsEtikett: (aktivitetsEtikett) => dispatch(toggleAktivitetsEtikett(aktivitetsEtikett)),
    doToggleAktivitetsStatus: (aktivitetsStatus) => dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
    doToggleAktivitetsType: (aktivitetsType) => dispatch(toggleAktivitetsType(aktivitetsType)),
    doVelgHistoriskPeriode: (historiskPeriode) => dispatch(velgHistoriskPeriode(historiskPeriode)),
    doToggleAktivitetAvtaltMedNav: (aktivitetsStatus) => dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisValgtFilter);
