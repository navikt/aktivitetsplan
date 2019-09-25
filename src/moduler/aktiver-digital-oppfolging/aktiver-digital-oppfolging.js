import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import { hentOppfolging, settDigital } from '../oppfolging-status/oppfolging-reducer';
import { STATUS } from '../../ducks/utils';
import { selectOppfolgingStatus, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import AktiverDigitalOppfolgingVarsel from './aktiver-digital-oppfolging-varsel';

export class AktiverDigitalOppfolgingPure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            harTrykketRefresh: false
        };
    }

    render() {
        const { reservertIKRR, doSettDigital, doHentOppfolging, lasterOppfolging, settOppfolgingFeilet } = this.props;

        const { harTrykketRefresh } = this.state;

        const ReservasjonDifiKnapp = () => (
            <HiddenIfHovedknapp
                spinner={lasterOppfolging}
                disabled={lasterOppfolging}
                hidden={!reservertIKRR}
                onClick={() => {
                    doHentOppfolging();
                    this.setState({ harTrykketRefresh: true });
                }}
            >
                <FormattedMessage id="sett-digital.manuell-oppfolging.reservasjon-difi-knapp" />
            </HiddenIfHovedknapp>
        );

        const AktiverDigitalOppfolgingKnapp = () => (
            <HiddenIfHovedknapp
                disabled={lasterOppfolging}
                hidden={reservertIKRR}
                onClick={doSettDigital}
                autoDisableVedSpinner
            >
                <FormattedMessage id="sett-digital.manuell-oppfolging.aktiver-digital-knapp" />
            </HiddenIfHovedknapp>
        );

        return (
            <div className="sett-digital">
                <AktiverDigitalOppfolgingVarsel
                    reservertIKRR={reservertIKRR}
                    settDigitalFeilet={settOppfolgingFeilet}
                    harTrykketRefresh={harTrykketRefresh}
                />
                <ReservasjonDifiKnapp />
                <AktiverDigitalOppfolgingKnapp />
            </div>
        );
    }
}

AktiverDigitalOppfolgingPure.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    lasterOppfolging: PT.bool.isRequired,
    settOppfolgingFeilet: PT.bool.isRequired,
    doSettDigital: PT.func.isRequired,
    doHentOppfolging: PT.func.isRequired
};

const mapStateToProps = state => {
    const oppfolgingStatus = selectOppfolgingStatus(state);

    const settOppfolgingFeilet = oppfolgingStatus === STATUS.ERROR;

    const lasterOppfolging = oppfolgingStatus === STATUS.PENDING || oppfolgingStatus === STATUS.RELOADING;

    return {
        reservertIKRR: selectReservasjonKRR(state),
        settOppfolgingFeilet,
        lasterOppfolging
    };
};

const mapDispatchToProps = dispatch => ({
    doSettDigital: () => dispatch(settDigital()),
    doHentOppfolging: () => dispatch(hentOppfolging())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AktiverDigitalOppfolgingPure);
