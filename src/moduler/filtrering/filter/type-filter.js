import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { AKTIVITESTYPE_FILER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { getAktivitetTypeBeskrivelse } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import { toggleAktivitetsType } from './filter-reducer';
import { selectAktivitetTyperFilter } from './filter-selector';
import FilterVisningsKomponent from './FilterVisning';

function TypeFilter({ harAktivitetTyper, aktivitetTyper, doToggleAktivitetsType }) {
    return (
        <FilterVisningsKomponent
            harAktiviteter={harAktivitetTyper}
            filter={aktivitetTyper}
            tekst="Aktivitetstype"
            filterTekst="aktivitet.type."
            metrikkNavn={AKTIVITESTYPE_FILER_METRIKK}
            doToggleFunction={doToggleAktivitetsType}
            textMapper={getAktivitetTypeBeskrivelse}
        />
    );
}

TypeFilter.propTypes = {
    harAktivitetTyper: PT.bool.isRequired,
    aktivitetTyper: PT.object.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
};

const mapStateToProps = (state) => {
    const aktiviteter = selectAktiviterForAktuellePerioden(state);
    const aktivitetTyperFilter = selectAktivitetTyperFilter(state);
    const aktivitetTyper = aktiviteter.reduce((typer, aktivitet) => {
        const { type } = aktivitet;
        typer[type] = aktivitetTyperFilter[type]; // eslint-disable-line no-param-reassign
        return typer;
    }, {});

    return {
        aktivitetTyper,
        harAktivitetTyper: Object.keys(aktivitetTyper).length > 1,
    };
};

const mapDispatchToProps = (dispatch) => ({
    doToggleAktivitetsType: (aktivitetsType) => dispatch(toggleAktivitetsType(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);
