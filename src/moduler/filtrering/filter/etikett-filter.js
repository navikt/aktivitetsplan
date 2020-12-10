import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { TILSTAND_FILTER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import { toggleAktivitetsEtikett } from './filter-reducer';
import { selectAktivitetEtiketterFilter } from './filter-selector';
import FilterVisningsKomponent from './filter-visning';

function EtikettFilter({ harAktivitetEtiketter, aktivitetEtiketter, doToggleAktivitetsEtikett }) {
    return (
        <FilterVisningsKomponent
            harAktiviteter={harAktivitetEtiketter}
            filter={aktivitetEtiketter}
            filterTittel="Etikett"
            filterTekst="aktivitet.etikett."
            metrikkNavn={TILSTAND_FILTER_METRIKK}
            doToggleFunction={doToggleAktivitetsEtikett}
        />
    );
}

EtikettFilter.propTypes = {
    harAktivitetEtiketter: PT.bool.isRequired,
    aktivitetEtiketter: PT.object.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
};

const mapStateToProps = (state) => {
    const aktiviteter = selectAktiviterForAktuellePerioden(state);
    const aktivitetEtiketterFilter = selectAktivitetEtiketterFilter(state);
    const aktivitetEtiketter = aktiviteter.reduce((etiketter, aktivitet) => {
        const { etikett } = aktivitet;
        if (etikett) {
            etiketter[etikett] = aktivitetEtiketterFilter[etikett]; // eslint-disable-line no-param-reassign
        }
        return etiketter;
    }, {});

    return {
        aktivitetEtiketter,
        harAktivitetEtiketter: Object.keys(aktivitetEtiketter).length >= 1,
    };
};

const mapDispatchToProps = (dispatch) => ({
    doToggleAktivitetsEtikett: (aktivitetsType) => dispatch(toggleAktivitetsEtikett(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EtikettFilter);
