import { Chips, Label } from '@navikt/ds-react';
import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { Store } from 'redux';

import { ReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import { VistOppfolgingsPeriode } from '../oppfolging-status/oppfolging-selector';
import {
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    toggleArenaAktivitetsEtikett,
    velgHistoriskPeriode,
} from './filter/filter-reducer';
import { selectFilterSlice } from './filter/filter-selector';
import { PeriodeLabel } from './filter/PeriodeFilter';
import FiltreringLabel from './filteringslabel/FiltreringLabel';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

//TODO se på det her, trengs kanskje ikke. hvis nødvendig, skriv det bort fra FormattedMessage
function VisValgtFilter(props: Props) {
    const {
        filterSlice,
        doToggleAktivitetsEtikett,
        doToggleArenaAktivitetsEtikett,
        doToggleAktivitetsStatus,
        doToggleAktivitetsType,
        doVelgHistoriskPeriode,
        doToggleAktivitetAvtaltMedNav,
    } = props;
    const setFilterValues = (filterType: string, filterVerdi: string) => {
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
            case 'arenaAktivitetEtiketter':
                return {
                    tekstPath: `aktivitet.etikett.${filterVerdi}`,
                    func: doToggleArenaAktivitetsEtikett,
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

    const activeFilterExists: boolean = Object.values(filterSlice).some((filterMap) => {
        if (!filterMap) return false;
        return Object.values(filterMap).some((value) => value === true);
    });

    return activeFilterExists ? (
        <div className="flex flex-wrap flex-col">
            <Label className="mb-2">Valgte filter</Label>
            <Chips>
                {Object.entries(filterSlice as Record<string, Record<string, string> | null>).map(
                    ([filterCategoryKey, activeFiltersMap]) => {
                        if (activeFiltersMap === null) return null;
                        if (filterCategoryKey === 'historiskPeriode') {
                            if (!activeFiltersMap) {
                                return null;
                            }
                            return (
                                <FiltreringLabel
                                    key={'historiskPeriode'}
                                    label={
                                        <PeriodeLabel
                                            historiskPeriode={activeFiltersMap as unknown as VistOppfolgingsPeriode}
                                        />
                                    }
                                    slettFilter={() => doVelgHistoriskPeriode(null)}
                                />
                            );
                        }

                        return Object.entries(activeFiltersMap)
                            .filter(([_, isFilterEnabled]) => isFilterEnabled)
                            .map(([activeFilterKey, _]) => {
                                const filterValues = setFilterValues(filterCategoryKey, activeFilterKey);
                                if (typeof filterValues === 'string') return null;
                                return (
                                    <FiltreringLabel
                                        key={activeFilterKey}
                                        label={<FormattedMessage id={filterValues.tekstPath.toLowerCase()} />}
                                        slettFilter={() => {
                                            filterValues.func(activeFilterKey);
                                        }}
                                    />
                                );
                            });
                    }
                )}
            </Chips>
        </div>
    ) : null;
}

(VisValgtFilter as any).defaultProps = {
    className: '',
};

(VisValgtFilter as any).propTypes = {
    filterSlice: PT.object.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
    doToggleArenaAktivitetsEtikett: PT.func.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
    doVelgHistoriskPeriode: PT.func.isRequired,
    doToggleAktivitetAvtaltMedNav: PT.func.isRequired,
    className: PT.string,
};

const mapStateToProps = (state: Store) => ({
    filterSlice: selectFilterSlice(state),
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    doToggleAktivitetsEtikett: (aktivitetsEtikett: string) => dispatch(toggleAktivitetsEtikett(aktivitetsEtikett)),
    doToggleArenaAktivitetsEtikett: (aktivitetsEtikett: string) =>
        dispatch(toggleArenaAktivitetsEtikett(aktivitetsEtikett)),
    doToggleAktivitetsStatus: (aktivitetsStatus: string) => dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
    doToggleAktivitetsType: (aktivitetsType: string) => dispatch(toggleAktivitetsType(aktivitetsType)),
    doVelgHistoriskPeriode: (historiskPeriode: string | null) => dispatch(velgHistoriskPeriode(historiskPeriode)),
    doToggleAktivitetAvtaltMedNav: (aktivitetsStatus: string) =>
        dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisValgtFilter);
