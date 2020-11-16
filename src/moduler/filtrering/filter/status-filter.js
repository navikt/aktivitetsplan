import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../constant';
import { STATUS_FILER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetliste-selector';
import { toggleAktivitetsStatus } from './filter-reducer';
import { selectAktivitetStatusFilter } from './filter-selector';
import FilterVisning from './filter-visning';

const filtreringsRekkefolge = [
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
];

function StatusFilter({ harAktivitetStatus, sortedAktivitetStatus, doToggleAktivitetsStatus, className }) {
    return (
        <FilterVisning
            harAktiviteter={harAktivitetStatus}
            filter={sortedAktivitetStatus}
            filterTittel="Status"
            filterTekst="aktivitet.status."
            metrikkNavn={STATUS_FILER_METRIKK}
            doToggleFunction={doToggleAktivitetsStatus}
            className={className}
        />
    );
}

StatusFilter.defaultProps = {
    className: '',
};

StatusFilter.propTypes = {
    harAktivitetStatus: PT.bool.isRequired,
    sortedAktivitetStatus: PT.object.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
    className: PT.string,
};

const mapStateToProps = (state) => {
    const aktiviteter = selectAktiviterForAktuellePerioden(state);
    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    const aktivitetStatus = aktiviteter.reduce((statusliste, aktivitet) => {
        const { status } = aktivitet;
        statusliste[status] = aktivitetStatusFilter[status]; // eslint-disable-line no-param-reassign
        return statusliste;
    }, {});
    const sortedAktivitetStatus = Object.keys(aktivitetStatus)
        .sort((a, b) => filtreringsRekkefolge.indexOf(a) - filtreringsRekkefolge.indexOf(b))
        .reduce(
            (sortertStatusFilter, item) => ({
                ...sortertStatusFilter,
                [item]: aktivitetStatus[item],
            }),
            {}
        );
    return {
        sortedAktivitetStatus,
        harAktivitetStatus: Object.keys(sortedAktivitetStatus).length > 1,
    };
};

const mapDispatchToProps = (dispatch) => ({
    doToggleAktivitetsStatus: (aktivitetsStatus) => dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusFilter);
