import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hentOppfolgingStatus } from '../../ducks/oppfolging-status';
import { INGEN_SJEKK_AV_VILKAR } from '~config';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/innholdslaster';
import Vilkar from './vilkar';

class OppfolgingStatus extends Component {

    componentDidMount() {
        this.props.doHentOppfolgingStatus();
    }

    render() {
        const { children, oppfolgingStatus, visVilkar } = this.props;
        const { status } = oppfolgingStatus.data;

        const vilkarGodkjent = status === 'GODKJENT';
        return (
            <Innholdslaster avhengigheter={[oppfolgingStatus]}>
                <div className="fullbredde">{visVilkar || !vilkarGodkjent ? <Vilkar visVilkar={visVilkar} visGodkjenning={!vilkarGodkjent} /> : children}</div>
            </Innholdslaster>
        );
    }
}

OppfolgingStatus.propTypes = {
    children: PT.node,
    visVilkar: PT.bool,
    oppfolgingStatus: AppPT.oppfolgingStatus.isRequired,
    doHentOppfolgingStatus: PT.func.isRequired
};

const mapStateToProps = (state) => ({
    oppfolgingStatus: state.data.oppfolgingStatus
});
const mapDispatchToProps = (dispatch) => ({
    doHentOppfolgingStatus: () => hentOppfolgingStatus()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
