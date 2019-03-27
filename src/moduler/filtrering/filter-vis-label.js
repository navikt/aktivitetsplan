import React from 'react';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { connect } from 'react-redux';
import PT from 'prop-types';
import classNames from 'classnames';
import { selectFilterSlice } from './filter/filter-selector';
import FiltreringLabel from './filteringslabel/filtering-label';
import { PeriodeLabel } from './filter/periode-filter';
import {
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    velgHistoriskPeriode,
} from './filter/filter-reducer';

const lesUrlParamFilterOgFiltrerPaaAktivitetsType = doToggleAktivitetsType => {
    const paramFilter = queryString.parse(location.search).filter;
    if (paramFilter) {
        if (Array.isArray(paramFilter)) {
            paramFilter.forEach(filterId => {
                doToggleAktivitetsType(filterId.toUpperCase());
            });
        } else {
            doToggleAktivitetsType(paramFilter.toUpperCase());
        }
    }
};

class VisValgtFilter extends React.PureComponent {
    componentDidMount() {
        lesUrlParamFilterOgFiltrerPaaAktivitetsType(
            this.props.doToggleAktivitetsType
        );
    }

    render() {
        const {
            filterSlice,
            doToggleAktivitetsEtikett,
            doToggleAktivitetsStatus,
            doToggleAktivitetsType,
            doVelgHistoriskPeriode,
            doToggleAktivitetAvtaltMedNav,
            className,
        } = this.props;
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
            <div
                className={classNames('filtrering-label-container', className)}
            >
                {Object.keys(filterSlice).map(filterKey => {
                    const filterValue = filterSlice[filterKey];

                    if (filterKey === 'historiskPeriode') {
                        if (!filterValue) {
                            return null;
                        }
                        return (
                            <FiltreringLabel
                                key={filterValue}
                                label={
                                    <PeriodeLabel
                                        historiskPeriode={filterValue}
                                    />
                                }
                                slettFilter={() => doVelgHistoriskPeriode(null)}
                            />
                        );
                    }

                    return Object.keys(filterSlice[filterKey])
                        .filter(f => filterValue[f])
                        .map(f => {
                            const filterValues = setFilterValues(filterKey, f);
                            return (
                                <FiltreringLabel
                                    key={f}
                                    label={
                                        <FormattedMessage
                                            id={filterValues.tekstPath.toLowerCase()}
                                        />
                                    }
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

const mapStateToProps = state => ({
    filterSlice: selectFilterSlice(state),
});

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsEtikett: aktivitetsEtikett =>
        dispatch(toggleAktivitetsEtikett(aktivitetsEtikett)),
    doToggleAktivitetsStatus: aktivitetsStatus =>
        dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
    doToggleAktivitetsType: aktivitetsType =>
        dispatch(toggleAktivitetsType(aktivitetsType)),
    doVelgHistoriskPeriode: historiskPeriode =>
        dispatch(velgHistoriskPeriode(historiskPeriode)),
    doToggleAktivitetAvtaltMedNav: aktivitetsStatus =>
        dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisValgtFilter);
