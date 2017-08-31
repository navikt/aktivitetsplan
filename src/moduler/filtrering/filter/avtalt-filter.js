import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectAktivitetAvtaltMedNavFilter } from './filter-selector';
import FilterVisningsKomponent from './filter-visnings-komponent';
import { selectAlleAktiviter } from '../../aktivitet/aktivitetliste-selector';
import { toggleAktivitetAvtaltMedNav } from './filter-reducer';

function AvtaltmedNavFilter({
    harAvtaltAktivitet,
    avtaltAktivitet,
    doToggleAktivitetAvtaltMedNav,
}) {
    return (
        <FilterVisningsKomponent
            harAktiviteter={harAvtaltAktivitet}
            filter={avtaltAktivitet}
            filterTittel={'filter.aktivitet.avtalt.tittel'}
            filterTekst={'aktivitet.'}
            doToggleFunction={doToggleAktivitetAvtaltMedNav}
        />
    );
}

AvtaltmedNavFilter.propTypes = {
    harAvtaltAktivitet: PT.bool.isRequired,
    avtaltAktivitet: PT.object.isRequired,
    doToggleAktivitetAvtaltMedNav: PT.func.isRequired,
};

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);
    const harAvtaltAktivitet =
        aktiviteter.filter(aktivitet => aktivitet.avtalt).length > 1;
    const avtaltMedNavFilter = selectAktivitetAvtaltMedNavFilter(state);
    const avtaltAktivitet = {
        avtaltMedNav: avtaltMedNavFilter.avtaltMedNav,
        ikkeAvtaltMedNav: avtaltMedNavFilter.ikkeAvtaltMedNav,
    };

    return {
        avtaltAktivitet,
        harAvtaltAktivitet,
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetAvtaltMedNav: aktivitetsStatus =>
        dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AvtaltmedNavFilter);
