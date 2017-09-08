import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import { ESKALERINGS_FILTER } from '../ducks/dialog';
import {
    selectEskaleringsDialoger,
    selectEskaleringsFilter,
} from '../moduler/dialog/dialog-selector';
import VisibleIfDiv from '../felles-komponenter/utils/visible-if-div';

function DialogFilter({
    erFilterAktivt,
    doToggleAktivitetsEtikett,
    harEskaleringer,
}) {
    return (
        <VisibleIfDiv visible={harEskaleringer}>
            <EskaleringsFilter
                toggleEskaleringsFilter={() => doToggleAktivitetsEtikett()}
                erFilterAktivt={erFilterAktivt}
            />
        </VisibleIfDiv>
    );
}

DialogFilter.propTypes = {
    erFilterAktivt: PT.bool.isRequired,
    harEskaleringer: PT.bool.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
};

const mapStateToProps = state => ({
    erFilterAktivt: selectEskaleringsFilter(state),
    harEskaleringer: selectEskaleringsDialoger(state).length > 0,
});

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsEtikett: () => dispatch(ESKALERINGS_FILTER),
});

function EskaleringsFilter({ toggleEskaleringsFilter, erFilterAktivt }) {
    return (
        <div>
            <Checkbox
                key={'dialog-filter'}
                label={<FormattedMessage id={'dialog.eskalerings-filter'} />}
                onChange={toggleEskaleringsFilter}
                checked={erFilterAktivt}
            />
        </div>
    );
}

EskaleringsFilter.propTypes = {
    erFilterAktivt: PT.bool.isRequired,
    toggleEskaleringsFilter: PT.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogFilter);
