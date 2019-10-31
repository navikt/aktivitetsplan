/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectErUnderOppfolging, selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { hentLest, selectLestInformasjon, selectLestStatus } from '../lest/lest-reducer';
import { selectErVeileder } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { INFORMASJON_MODAL_VERSJON } from './informasjon-modal';
import { STATUS } from '../../ducks/utils';
import { loggTidBruktGaaInnPaaAktivitetsplanen } from '../../felles-komponenter/utils/logging';
import { setBackPath } from './informasjon-reducer';

const redirectPath = '/informasjon';

class RedirectTilInformasjon extends Component {
    componentDidMount() {
        const { erVeileder, history, location, setBack } = this.props;
        const path = location.pathname;

        if (path === redirectPath || erVeileder) {
            return;
        }

        setBack(path);
        history.push(redirectPath);
    }

    render() {
        return null;
    }
}

RedirectTilInformasjon.propTypes = {
    history: AppPT.history.isRequired,
    erVeileder: PT.bool.isRequired,
    location: PT.shape({ pathname: PT.string.isRequired }).isRequired,
    setBack: PT.func.isRequired
};

const RedirectTilInformasjonWithRouter = withRouter(RedirectTilInformasjon);

class InformasjonsHenting extends Component {
    componentDidMount() {
        const { underOppfolging, oppfolgingsPerioder, doHentLest } = this.props;
        if (underOppfolging) {
            doHentLest().then(a => {
                loggTidBruktGaaInnPaaAktivitetsplanen(a.data, oppfolgingsPerioder);
            });
        }
    }

    render() {
        const { props } = this;
        const videreSendTilInfo =
            props.lestStatus === STATUS.OK && (!props.lestInfo || props.lestInfo.verdi !== INFORMASJON_MODAL_VERSJON);

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
    oppfolgingsPerioder: PT.arrayOf(PT.object).isRequired,
    lestStatus: AppPT.status.isRequired,
    lestInfo: AppPT.lest,
    setBack: PT.func.isRequired
};

InformasjonsHenting.defaultProps = {
    lestInfo: undefined
};

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
    lestStatus: selectLestStatus(state),
    lestInfo: selectLestInformasjon(state),
    erVeileder: selectErVeileder(state),
    oppfolgingsPerioder: selectOppfolgingsPerioder(state)
});

const mapDispatchToProps = dispatch => ({
    doHentLest: () => dispatch(hentLest()),
    setBack: path => dispatch(setBackPath(path))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InformasjonsHenting);
