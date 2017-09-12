import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import { ESKALERINGS_FILTER } from '../ducks/dialog';
import {
    selectEskaleringsFilter,
    selectHarEskaleringer,
} from '../moduler/dialog/dialog-selector';
import VisibleIfDiv from '../felles-komponenter/utils/visible-if-div';
import {selectErBruker} from "../moduler/identitet/identitet-selector";

function EskaleringsFilter({ doToggleEskaleringsFilter, erFilterAktivt }) {
    return (
        <Checkbox
            key={'dialog-filter'}
            label={<FormattedMessage id={'dialog.eskalerings-filter'} />}
            onChange={doToggleEskaleringsFilter}
            checked={erFilterAktivt}
        />
    );
}

EskaleringsFilter.propTypes = {
    erFilterAktivt: PT.bool.isRequired,
    doToggleEskaleringsFilter: PT.func.isRequired,
};

function DialogFilter({
    erFilterAktivt,
    doToggleEskaleringsFilter,
    harEskaleringer,
    erBruker
}) {
    return (
        <VisibleIfDiv visible={harEskaleringer && erBruker}>
            <EskaleringsFilter
                doToggleEskaleringsFilter={doToggleEskaleringsFilter}
                erFilterAktivt={erFilterAktivt}
            />
        </VisibleIfDiv>
    );
}

DialogFilter.propTypes = {
    erFilterAktivt: PT.bool.isRequired,
    harEskaleringer: PT.bool.isRequired,
    doToggleEskaleringsFilter: PT.func.isRequired,
    erBruker: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erFilterAktivt: selectEskaleringsFilter(state),
    harEskaleringer: selectHarEskaleringer(state),
    erBruker: selectErBruker(state),
});

const mapDispatchToProps = dispatch => ({
    doToggleEskaleringsFilter: () => dispatch(ESKALERINGS_FILTER),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogFilter);
