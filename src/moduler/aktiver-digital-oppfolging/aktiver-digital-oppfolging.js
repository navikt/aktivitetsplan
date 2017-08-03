import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
    AdvarselVarsling,
    Varsling,
    VarslingMedLenke,
} from '../varslinger/varsel-alertstriper';
import { settDigital } from './aktiver-digital-oppfolging-reducer';
import { STATUS } from '../../ducks/utils';
import { hentSituasjon } from '../situasjon/situasjon';
import {
    selectReservasjonKRR,
    selectSituasjonReducer,
} from '../situasjon/situasjon-selector';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';

export function AktiverDigitalOppfolgingVarsel({
    reservertIKRR,
    settDigitalFeilet,
    harTrykketRefresh,
}) {
    if (!reservertIKRR && !settDigitalFeilet) {
        return (
            <Varsling
                tekstId="sett-digital.manuell-oppfolging.infotekst"
                className="sett-digital__varsel"
            />
        );
    } else if (reservertIKRR && !settDigitalFeilet) {
        const resertvertTekst = harTrykketRefresh
            ? 'sett-digital.reservert-i-krr.fjern.reservasjon.infotekst'
            : 'sett-digital.reservert-i-krr.infotekst';
        return (
            <FormattedMessage id="sett-digital.reservert-i-krr.url-lenke">
                {url =>
                    <VarslingMedLenke
                        tekstId={resertvertTekst}
                        lenkeTekstId="sett-digital.reservert-i-krr.lenketekst"
                        href={url}
                        className="sett-digital__varsel"
                    />}
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
            doHentSituasjon,
            setterDigital,
            lasterSituasjon,
            settDigitalFeilet,
        } = this.props;

        const ReservasjonDifiKnapp = () =>
            <HiddenIfHovedknapp
                mini
                spinner={lasterSituasjon}
                disabled={lasterSituasjon}
                hidden={!reservertIKRR}
                onClick={() => {
                    doHentSituasjon();
                    this.setState({ harTrykketRefresh: true });
                }}
            >
                <FormattedMessage id="sett-digital.manuell-oppfolging.reservasjon-difi-knapp" />
            </HiddenIfHovedknapp>;

        const AktiverDigitalOppfolgingKnapp = () =>
            <HiddenIfHovedknapp
                mini
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
    lasterSituasjon: PT.bool.isRequired,
    setterDigital: PT.bool.isRequired,
    settDigitalFeilet: PT.bool.isRequired,
    doSettDigital: PT.func.isRequired,
    doHentSituasjon: PT.func.isRequired,
};

const mapStateToProps = state => {
    const aktiverDigitalOppfolgingReducer = state.data.aktiverDigitalOppfolging;
    const situasjonReducer = selectSituasjonReducer(state);

    const aktiverDigitalOppfolgingStatus =
        aktiverDigitalOppfolgingReducer.status;
    const settDigitalFeilet = aktiverDigitalOppfolgingStatus === STATUS.ERROR;

    const setterDigital =
        aktiverDigitalOppfolgingStatus === STATUS.PENDING ||
        aktiverDigitalOppfolgingStatus === STATUS.RELOADING;

    const situasjonStatus = situasjonReducer.status;
    const lasterSituasjon =
        situasjonStatus === STATUS.PENDING ||
        situasjonStatus === STATUS.RELOADING;

    return {
        reservertIKRR: selectReservasjonKRR(state),
        settDigitalFeilet,
        setterDigital,
        lasterSituasjon,
    };
};

const mapDispatchToProps = dispatch => ({
    doSettDigital: () => dispatch(settDigital()),
    doHentSituasjon: () => dispatch(hentSituasjon()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AktiverDigitalOppfolgingPure
);
