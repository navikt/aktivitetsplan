import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import * as AppPT from '../../proptypes';
import { ESKALERINGS_FILTER } from './dialog-reducer';
import { selectEskaleringsFilter, selectVisEskaleringsFilter } from './dialog-selector';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import lazyHOC from '../../felles-komponenter/lazy/lazyHOC';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectIdentitetStatus } from '../identitet/identitet-selector';

function EskaleringsFilter({ doToggleEskaleringsFilter, erFilterAktivt }) {
    return (
        <Checkbox
            key="dialog-filter"
            label={<FormattedMessage id="dialog.eskalerings-filter" />}
            onChange={doToggleEskaleringsFilter}
            checked={erFilterAktivt}
        />
    );
}

EskaleringsFilter.propTypes = {
    erFilterAktivt: PT.bool.isRequired,
    doToggleEskaleringsFilter: PT.func.isRequired
};

function DialogFilter({ erFilterAktivt, doToggleEskaleringsFilter, visEskaleringsFilter }) {
    return (
        <VisibleIfDiv visible={visEskaleringsFilter} className="dialog-modal__eskalerings-filter">
            <EskaleringsFilter doToggleEskaleringsFilter={doToggleEskaleringsFilter} erFilterAktivt={erFilterAktivt} />
        </VisibleIfDiv>
    );
}

DialogFilter.propTypes = {
    erFilterAktivt: PT.bool.isRequired,
    visEskaleringsFilter: PT.bool.isRequired,
    doToggleEskaleringsFilter: PT.func.isRequired
};

const LazyDialogFilter = lazyHOC(DialogFilter);

function DialogFilterMedInnholdslaster({ avhengigheter, ...props }) {
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <LazyDialogFilter {...props} />
        </Innholdslaster>
    );
}

DialogFilterMedInnholdslaster.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired
};

const mapStateToProps = state => ({
    avhengigheter: [selectIdentitetStatus(state)],
    erFilterAktivt: selectEskaleringsFilter(state),
    visEskaleringsFilter: selectVisEskaleringsFilter(state)
});

const mapDispatchToProps = dispatch => ({
    doToggleEskaleringsFilter: () => dispatch(ESKALERINGS_FILTER)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogFilterMedInnholdslaster);
