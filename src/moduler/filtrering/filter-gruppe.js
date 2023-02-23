import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import {
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    velgHistoriskPeriode,
} from './filter/filter-reducer';
import { PeriodeLabel } from './filter/PeriodeFilter';
import FiltreringLabel from './filteringslabel/FiltreringLabel';

function FilterGruppe({
    filterKey,
    filterValue,
    doToggleAktivitetsEtikett,
    doToggleAktivitetsStatus,
    doToggleAktivitetsType,
    doVelgHistoriskPeriode,
    doToggleAktivitetAvtaltMedNav,
}) {
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

    if (filterKey === 'historiskPeriode') {
        return (
            <VisibleIfDiv visible={!!filterValue} className="filtrering-label-container">
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
            {Object.keys(filterValue)
                .filter((f) => filterValue[f])
                .map((f) => {
                    const filterValues = setFilterValues(filterKey, f);
                    return (
                        <FiltreringLabel
                            key={f}
                            label={<FormattedMessage id={filterValues.tekstPath.toLowerCase()} />}
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
    doToggleAktivitetAvtaltMedNav: PT.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    doToggleAktivitetsEtikett: (aktivitetsEtikett) => dispatch(toggleAktivitetsEtikett(aktivitetsEtikett)),
    doToggleAktivitetsStatus: (aktivitetsStatus) => dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
    doToggleAktivitetsType: (aktivitetsType) => dispatch(toggleAktivitetsType(aktivitetsType)),
    doVelgHistoriskPeriode: (historiskPeriode) => dispatch(velgHistoriskPeriode(historiskPeriode)),
    doToggleAktivitetAvtaltMedNav: (aktivitetsStatus) => dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus)),
});

export default connect(null, mapDispatchToProps)(FilterGruppe);
