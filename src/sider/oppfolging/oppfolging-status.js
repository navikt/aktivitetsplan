import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hentOppfolgingStatus } from '../../ducks/oppfolging-status';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import Vilkar from './vilkar';

class OppfolgingStatus extends Component {

    componentDidMount() {
        this.props.doHentOppfolgingStatus();
    }

    render() {
        const { children, oppfolgingStatus, visVilkar } = this.props;
        const { vilkarMaBesvares } = oppfolgingStatus.data;

        return (
            <Innholdslaster avhengigheter={[oppfolgingStatus]}>
                <div className="fullbredde">{visVilkar || vilkarMaBesvares ? <Vilkar visVilkar={visVilkar} visGodkjenning={vilkarMaBesvares} /> : children}</div>
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
