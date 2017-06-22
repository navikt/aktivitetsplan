import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import hiddenIfHoc from './../../felles-komponenter/hidden-if/hidden-if';
import { kanAvslutte } from '../../ducks/situasjon';
import { STATUS } from './../../ducks/utils';
import history from '../../history';
import StartProsess from './start-prosess';

class AvsluttOppfolgingProsess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kanAvslutte: false,
            harSjekket: false,
        };
    }

    gaTilBekreft = url => {
        this.props.doKanAvslutte().then(response => {
            this.setState({
                kanAvslutte: response.data.avslutningStatus.kanAvslutte,
                harSjekket: true,
            });
            if (this.state.kanAvslutte) {
                history.push(url);
            }
        });
    };

    render() {
        const { avslutningStatus, laster, intl } = this.props;
        return (
            <StartProsess
                className="innstillinger__prosess"
                tittel={intl.formatMessage({
                    id: 'innstillinger.prosess.avslutt.tittel',
                })}
                knappetekst={intl.formatMessage({
                    id: 'innstillinger.modal.prosess.start.knapp',
                })}
                laster={laster}
                onClick={() => this.gaTilBekreft('/innstillinger/avslutt')}
            >
                <div className="blokk-xs">
                    <Normaltekst>
                        <FormattedMessage id="innstillinger.prosess.avslutt.tekst" />
                    </Normaltekst>
                    {this.state.harSjekket &&
                        !this.state.kanAvslutte &&
                        <AlertStripeInfoSolid>
                            <ul>
                                {avslutningStatus.underOppfolging &&
                                <li>
                                    <FormattedMessage
                                        id="innstillinger.prosess.avslutt-oppfolging.feil.under-oppfolging" />
                                </li>}
                                {avslutningStatus.harYtelser &&
                                <li>
                                    <FormattedMessage
                                        id="innstillinger.prosess.avslutt-oppfolging.feil.aktive-ytelser" />
                                </li>}
                                {avslutningStatus.harTiltak &&
                                <li>
                                    <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.aktive-tiltak" />
                                </li>}
                            </ul>
                        </AlertStripeInfoSolid>}
                </div>
            </StartProsess>
        );
    }
}

AvsluttOppfolgingProsess.propTypes = {
    intl: intlShape.isRequired,
    laster: PT.bool.isRequired,
    doKanAvslutte: PT.func.isRequired,
    avslutningStatus: PT.func.isRequired,
};

const mapStateToProps = state => ({
    underOppfolging: state.data.situasjon.data.underOppfolging,
    avslutningStatus: state.data.situasjon.data.avslutningStatus,
    kanStarte: state.data.situasjon.data.kanStarteOppfolging,
    laster: state.data.situasjon.status === STATUS.RELOADING,
});

const mapDispatchToProps = dispatch => ({
    doKanAvslutte: () => dispatch(kanAvslutte()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(injectIntl(AvsluttOppfolgingProsess))
);
