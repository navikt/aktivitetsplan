import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectAktivitetStatusFilter } from './filter-selector';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetliste-selector';
import { toggleAktivitetsStatus } from './filter-reducer';
import FilterVisning from './filter-visnings-komponent';

function StatusFilter({
    harAktivitetStatus,
    aktivitetStatus,
    doToggleAktivitetsStatus,
    className,
}) {
    return (
        <FilterVisning
            harAktiviteter={harAktivitetStatus}
            filter={aktivitetStatus}
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
    aktivitetStatus: PT.object.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
    className: PT.string,
};

const mapStateToProps = state => {
    const aktiviteter = selectAktiviterForAktuellePerioden(state);
    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    const aktivitetStatus = aktiviteter.reduce((statusliste, aktivitet) => {
        const status = aktivitet.status;
        statusliste[status] = aktivitetStatusFilter[status]; // eslint-disable-line no-param-reassign
        return statusliste;
    }, {});
    return {
        aktivitetStatus,
        harAktivitetStatus: Object.keys(aktivitetStatus).length > 1,
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsStatus: aktivitetsStatus =>
        dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusFilter);
