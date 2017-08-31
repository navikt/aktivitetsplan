import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    velgHistoriskPeriode,
} from './filter/filter-reducer';
import FiltreringLabel from './filteringslabel/filtering-label';
import { PeriodeLabel } from './filter/periode-filter';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function FilterGruppe({
    filterKey,
    filterValue,
    doToggleAktivitetsEtikett,
    doToggleAktivitetsStatus,
    doToggleAktivitetsType,
    doVelgHistoriskPeriode,
}) {
    const setFilterValues = (filterType, filterVarde) => {
        switch (filterType) {
            case 'aktivitetTyper':
                return {
                    tekstPath: `aktivitet.type.${filterVarde}`,
                    func: doToggleAktivitetsType,
                };
            case 'aktivitetEtiketter':
                return {
                    tekstPath: `aktivitet.etikett.${filterVarde}`,
                    func: doToggleAktivitetsEtikett,
                };
            case 'aktivitetStatus':
                return {
                    tekstPath: `aktivitet.status.${filterVarde}`,
                    func: doToggleAktivitetsStatus,
                };
            default:
                return filterType;
        }
    };

    if (filterKey === 'historiskPeriode') {
        return (
            <VisibleIfDiv
                visible={!!filterValue}
                className="filtrering-label-container"
            >
                <FiltreringLabel
                    key={filterValue}
                    label={<PeriodeLabel historiskPeriode={filterValue} />}
                    slettFilter={() => doVelgHistoriskPeriode(null)}
                />
            </VisibleIfDiv>
        );
    }
    return (
        <div className="filtrering-label-container">
            {Object.keys(filterValue).filter(f => filterValue[f]).map(f => {
                const filterValues = setFilterValues(filterKey, f);
                console.log(filterValues);
                return (
                    <FiltreringLabel
                        key={f}
                        label={
                            <FormattedMessage
                                id={filterValues.tekstPath.toLowerCase()}
                            />
                        }
                        slettFilter={() => filterValues.func(f)}
                    />
                );
            })}
        </div>
    );
}

FilterGruppe.defaultProps = {
    filterKey: '',
    filterValue: null,
};

FilterGruppe.propTypes = {
    filterKey: PT.string,
    filterValue: PT.object,
    doToggleAktivitetsEtikett: PT.func.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
    doVelgHistoriskPeriode: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsEtikett: aktivitetsEtikett =>
        dispatch(toggleAktivitetsEtikett(aktivitetsEtikett)),
    doToggleAktivitetsStatus: aktivitetsStatus =>
        dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
    doToggleAktivitetsType: aktivitetsType =>
        dispatch(toggleAktivitetsType(aktivitetsType)),
    doVelgHistoriskPeriode: historiskPeriode =>
        dispatch(velgHistoriskPeriode(historiskPeriode)),
});

export default connect(null, mapDispatchToProps)(FilterGruppe);
