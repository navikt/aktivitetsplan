import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import {
    kanAvslutteOppfolging,
    SLETT_BEGRUNNELSE_ACTION,
} from '../innstillinger-reducer';
import { STATUS } from '../../../ducks/utils';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import * as AppPT from '../../../proptypes';

class AvsluttOppfolgingProsess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kanAvslutte: false,
            harSjekket: false,
        };
    }

    gaTilBekreft = url => {
        this.props
            .doKanAvslutteOppfolging()
            .then(response => {
                this.setState({
                    kanAvslutte: response.data.avslutningStatus.kanAvslutte,
                    harSjekket: true,
                });
                if (this.state.kanAvslutte) {
                    history.push(url);
                }
            })
    };

    render() {
        const { avslutningStatus, laster, intl, slettBegrunnelse } = this.props;
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
                onClick={() => {
                    slettBegrunnelse();
                    this.gaTilBekreft('/innstillinger/avslutt');
                }}
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
                                        <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.under-oppfolging" />
                                    </li>}
                                {avslutningStatus.harYtelser &&
                                    <li>
                                        <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.aktive-ytelser" />
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

AvsluttOppfolgingProsess.defaultProps = {
    avslutningStatus: undefined,
};

AvsluttOppfolgingProsess.propTypes = {
    intl: intlShape.isRequired,
    laster: PT.bool.isRequired,
    doKanAvslutteOppfolging: PT.func.isRequired,
    slettBegrunnelse: PT.func.isRequired,
    avslutningStatus: AppPT.avslutningStatus,
};

const mapStateToProps = state => ({
    avslutningStatus: state.data.innstillinger.data.avslutningStatus,
    kanStarte: state.data.innstillinger.data.kanStarteOppfolging,
    laster: state.data.innstillinger.status === STATUS.RELOADING,
});

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => dispatch(SLETT_BEGRUNNELSE_ACTION),
    doKanAvslutteOppfolging: () => dispatch(kanAvslutteOppfolging()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(injectIntl(AvsluttOppfolgingProsess))
);
