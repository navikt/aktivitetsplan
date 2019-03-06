/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import {
    hentLest,
    selectLestInformasjon,
    selectLestStatus,
} from '../lest/lest-reducer';
import { selectErVeileder } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { INFORMASJON_MODAL_VERSJON } from './informasjon-modal';
import { STATUS } from '../../ducks/utils';

class RedirectTilInformasjon extends Component {
    componentWillMount() {
        const { erVeileder, history } = this.props;
        if (!erVeileder) {
            history.push('/informasjon');
        }
    }

    render() {
        return null;
    }
}

RedirectTilInformasjon.propTypes = {
    history: AppPT.history.isRequired,
    erVeileder: PT.bool.isRequired,
};

const RedirectTilInformasjonWithRouter = withRouter(RedirectTilInformasjon);

class InformasjonsHenting extends Component {
    componentWillMount() {
        if (this.props.underOppfolging) {
            this.props.doHentLest();
        }
    }
    render() {
        const props = this.props;
        const videreSendTilInfo =
            props.lestStatus === STATUS.OK &&
            (!props.lestInfo ||
                props.lestInfo.verdi !== INFORMASJON_MODAL_VERSJON);

        if (videreSendTilInfo) {
            return <RedirectTilInformasjonWithRouter {...props} />;
        }

        return null;
    }
}

InformasjonsHenting.propTypes = {
    erVeileder: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    doHentLest: PT.func.isRequired,
};

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
    lestStatus: selectLestStatus(state),
    lestInfo: selectLestInformasjon(state),
    erVeileder: selectErVeileder(state),
});

const mapDispatchToProps = dispatch => ({
    doHentLest: () => dispatch(hentLest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    InformasjonsHenting
);
