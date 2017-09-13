import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectAktivitetStatusFilter } from './filter-selector';
import { selectAlleAktiviter } from '../../aktivitet/aktivitetliste-selector';
import { toggleAktivitetsStatus } from './filter-reducer';
import FilterVisning from './filter-visnings-komponent';

const filtreringsRekkefolge = {
    BRUKER_ER_INTERESSERT: 0,
    PLANLAGT: 1,
    GJENNOMFORES: 2,
    FULLFORT: 3,
    AVBRUTT: 4,
};
function StatusFilter({
    harAktivitetStatus,
    sortedAktivitetStatus,
    doToggleAktivitetsStatus,
    className,
}) {
    return (
        <FilterVisning
            harAktiviteter={harAktivitetStatus}
            filter={sortedAktivitetStatus}
            filterTittel={'aktivitet.status'}
            filterTekst={'aktivitet.status.'}
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

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);
    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    const aktivitetStatus = aktiviteter.reduce((statusliste, aktivitet) => {
        const status = aktivitet.status;
        statusliste[status] = aktivitetStatusFilter[status]; // eslint-disable-line no-param-reassign
        return statusliste;
    }, {});
    const sortedAktivitetStatus = Object.keys(aktivitetStatus)
        .sort((a, b) => filtreringsRekkefolge[a] - filtreringsRekkefolge[b])
        .reduce(
            (sortertStatusFilter, item, index) => ({
                ...sortertStatusFilter,
                [item]: aktivitetStatus[index],
            }),
            {}
        );
    return {
        sortedAktivitetStatus,
        harAktivitetStatus: Object.keys(sortedAktivitetStatus).length > 1,
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsStatus: aktivitetsStatus =>
        dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusFilter);
