import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { AdvarselVarsling } from '../varslinger/varsel-alertstriper';
import { settDigital } from './aktiver-digital-oppfolging-reducer';
import { STATUS } from '../../ducks/utils';
import { hentOppfolging } from '../oppfolging/oppfolging-reducer';
import {
    selectReservasjonKRR,
    selectOppfolgingStatus,
} from '../oppfolging/oppfolging-selector';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import Lenke from '../../felles-komponenter/utils/lenke';
import { selectAktiverDigitalOppfolgingStatus } from './aktiver-digital-oppfolgning-selector';

export function AktiverDigitalOppfolgingVarsel({
    reservertIKRR,
    settDigitalFeilet,
    harTrykketRefresh,
}) {
    const InformasjonContainer = () =>
        <div>
            <FormattedMessage id="informasjon-mer" />&nbsp;
            <Lenke href="/informasjon">
                <FormattedMessage id="informasjon-mer-lenke" />
            </Lenke>
        </div>;

    if (!reservertIKRR && !settDigitalFeilet) {
        return (
            <AlertStripeInfoSolid className="sett-digital__varsel">
                <div>
                    <FormattedMessage id="sett-digital.manuell-oppfolging.infotekst" />
                </div>
                <InformasjonContainer />
            </AlertStripeInfoSolid>
        );
    } else if (reservertIKRR && !settDigitalFeilet) {
        const resertvertTekst = harTrykketRefresh
            ? 'sett-digital.reservert-i-krr.fjern.reservasjon.infotekst'
            : 'sett-digital.reservert-i-krr.infotekst';
        return (
            <FormattedMessage id="sett-digital.reservert-i-krr.url-lenke">
                {url =>
                    <AlertStripeInfoSolid className="sett-digital__varsel">
                        <div className="blokk-s">
                            <FormattedMessage id={resertvertTekst} />&nbsp;
                            <Lenke href={url}>
                                <FormattedMessage id="sett-digital.reservert-i-krr.lenketekst" />
                            </Lenke>
                        </div>
                        <InformasjonContainer />
                    </AlertStripeInfoSolid>}
            </FormattedMessage>
        );
    } else if (settDigitalFeilet) {
        return (
            <AdvarselVarsling
                tekstId="sett-digital.feilmelding"
                className="sett-digital__varsel"
            />
        );
    }
}

AktiverDigitalOppfolgingVarsel.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    settDigitalFeilet: PT.bool.isRequired,
    harTrykketRefresh: PT.bool.isRequired,
};

export class AktiverDigitalOppfolgingPure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            harTrykketRefresh: false,
        };
    }

    render() {
        const {
            reservertIKRR,
            doSettDigital,
            doHentOppfolging,
            setterDigital,
            lasterOppfolging,
            settDigitalFeilet,
        } = this.props;

        const ReservasjonDifiKnapp = () =>
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
            </HiddenIfHovedknapp>;

        const AktiverDigitalOppfolgingKnapp = () =>
            <HiddenIfHovedknapp
                spinner={setterDigital}
                disabled={setterDigital}
                hidden={reservertIKRR}
                onClick={doSettDigital}
            >
                <FormattedMessage id="sett-digital.manuell-oppfolging.aktiver-digital-knapp" />
            </HiddenIfHovedknapp>;

        return (
            <div className="sett-digital">
                <AktiverDigitalOppfolgingVarsel
                    reservertIKRR={reservertIKRR}
                    settDigitalFeilet={settDigitalFeilet}
                    harTrykketRefresh={this.state.harTrykketRefresh}
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
    setterDigital: PT.bool.isRequired,
    settDigitalFeilet: PT.bool.isRequired,
    doSettDigital: PT.func.isRequired,
    doHentOppfolging: PT.func.isRequired,
};

const mapStateToProps = state => {
    const aktiverDigitalOppfolgingStatus = selectAktiverDigitalOppfolgingStatus(
        state
    );
    const settDigitalFeilet = aktiverDigitalOppfolgingStatus === STATUS.ERROR;

    const setterDigital =
        aktiverDigitalOppfolgingStatus === STATUS.PENDING ||
        aktiverDigitalOppfolgingStatus === STATUS.RELOADING;

    const oppfolgingStatus = selectOppfolgingStatus(state);
    const lasterOppfolging =
        oppfolgingStatus === STATUS.PENDING ||
        oppfolgingStatus === STATUS.RELOADING;

    return {
        reservertIKRR: selectReservasjonKRR(state),
        settDigitalFeilet,
        setterDigital,
        lasterOppfolging,
    };
};

const mapDispatchToProps = dispatch => ({
    doSettDigital: () => dispatch(settDigital()),
    doHentOppfolging: () => dispatch(hentOppfolging()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AktiverDigitalOppfolgingPure
);
