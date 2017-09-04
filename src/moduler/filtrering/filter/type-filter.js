import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { toggleAktivitetsType } from './filter-reducer';
import { selectAktivitetTyperFilter } from './filter-selector';
import { selectAlleAktiviter } from '../../aktivitet/aktivitetliste-selector';
import FilterVisningsKomponent from './filter-visnings-komponent';

function TypeFilter({
    harAktivitetTyper,
    aktivitetTyper,
    doToggleAktivitetsType,
}) {
    return (
        <FilterVisningsKomponent
            harAktiviteter={harAktivitetTyper}
            filter={aktivitetTyper}
            filterTittel={'filter.aktivitet.type.tittel'}
            filterTekst={'aktivitet.type.'}
            doToggleFunction={doToggleAktivitetsType}
        />
    );
}

TypeFilter.propTypes = {
    harAktivitetTyper: PT.bool.isRequired,
    aktivitetTyper: PT.object.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
};

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);
    const aktivitetTyperFilter = selectAktivitetTyperFilter(state);
    const aktivitetTyper = aktiviteter.reduce((typer, aktivitet) => {
        const type = aktivitet.type;
        typer[type] = aktivitetTyperFilter[type]; // eslint-disable-line no-param-reassign
        return typer;
    }, {});

    return {
        aktivitetTyper,
        harAktivitetTyper: Object.keys(aktivitetTyper).length > 1,
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsType: aktivitetsType =>
        dispatch(toggleAktivitetsType(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);
