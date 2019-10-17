import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectAktivitetAvtaltMedNavFilter } from './filter-selector';
import FilterVisningsKomponent from './filter-visning';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetliste-selector';
import { toggleAktivitetAvtaltMedNav } from './filter-reducer';
import { AVTALT_FILER_METRIKK } from '../../../felles-komponenter/utils/logging';

function AvtaltmedNavFilter({ harAvtaltAktivitet, avtaltAktivitet, doToggleAktivitetAvtaltMedNav }) {
    return (
        <FilterVisningsKomponent
            harAktiviteter={harAvtaltAktivitet}
            filter={avtaltAktivitet}
            filterTittel="Avtalt aktivitet"
            filterTekst="aktivitet."
            metrikkNavn={AVTALT_FILER_METRIKK}
            doToggleFunction={doToggleAktivitetAvtaltMedNav}
        />
    );
}

AvtaltmedNavFilter.propTypes = {
    harAvtaltAktivitet: PT.bool.isRequired,
    avtaltAktivitet: PT.object.isRequired,
    doToggleAktivitetAvtaltMedNav: PT.func.isRequired
};

const mapStateToProps = state => {
    const aktiviteter = selectAktiviterForAktuellePerioden(state);
    const harAvtaltAktivitet =
        aktiviteter.filter(aktivitet => aktivitet.avtalt).length > 0 &&
        aktiviteter.filter(aktivitet => !aktivitet.avtalt).length > 0;
    const avtaltMedNavFilter = selectAktivitetAvtaltMedNavFilter(state);
    const avtaltAktivitet = {
        avtaltMedNav: avtaltMedNavFilter.avtaltMedNav,
        ikkeAvtaltMedNav: avtaltMedNavFilter.ikkeAvtaltMedNav
    };

    return {
        avtaltAktivitet,
        harAvtaltAktivitet
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetAvtaltMedNav: aktivitetsStatus => dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AvtaltmedNavFilter);
