import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'nav-frontend-skjema';
import { selectAktivitetAvtaltMedNavFilter } from './filter-selector';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import { selectAlleAktiviter } from '../../aktivitet/aktivitetliste-selector';
import { toggleAktivitetAvtaltMedNav } from './filter-reducer';

function AvtaltmedNavFilter({
    harAvtaltAktivitet,
    avtaltAktivitet,
    doToggleAktivitetAvtaltMedNav,
}) {
    return (
        <VisibleIfDiv visible={harAvtaltAktivitet}>
            <Undertittel>
                <FormattedMessage id="filter.aktivitet.etikett.tittel" />
            </Undertittel>
            <Checkbox
                key={'avtaltMedNav'}
                label={<FormattedMessage id={'aktivitet.avtalt-med-nav'} />}
                onChange={() => doToggleAktivitetAvtaltMedNav('avtaltMedNav')}
                checked={avtaltAktivitet.avtaltMedNav}
            />

            <Checkbox
                key={'ikkeAvtaltMedNav'}
                label={
                    <FormattedMessage id={'aktivitet.ikke-avtalt-med-nav'} />
                }
                onChange={() =>
                    doToggleAktivitetAvtaltMedNav('ikkeAvtaltMedNav')}
                checked={avtaltAktivitet.ikkeAvtaltMedNav}
            />
        </VisibleIfDiv>
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
        aktiviteter.filter(aktivitet => aktivitet.avtalt).length > 0;
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
