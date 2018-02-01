import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import {
    kanAvslutteOppfolging,
    SLETT_BEGRUNNELSE_ACTION,
} from '../innstillinger-reducer';
import { STATUS } from '../../../ducks/utils';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import * as AppPT from '../../../proptypes';
import {
    selectAvslutningStatus,
    selectInnstillingerStatus,
    selectKanStarteOppfolging,
} from '../innstillinger-selector';
import { HiddenIfAlertStripeInfoSolid } from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';

class AvsluttOppfolgingProsess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kanAvslutte: false,
            harSjekket: false,
        };
    }

    gaTilBekreft = url => {
        this.props.doKanAvslutteOppfolging().then(response => {
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
        const { avslutningStatus, laster, slettBegrunnelse } = this.props;
        const { underOppfolging, harYtelser, harTiltak, underKvp } =
            avslutningStatus || {};
        const { harSjekket, kanAvslutte } = this.state;
        return (
            <StartProsess
                className="innstillinger__prosess"
                tittelId="innstillinger.prosess.avslutt.tittel"
                knappetekstId="innstillinger.modal.prosess.start.knapp"
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
                    <HiddenIfAlertStripeInfoSolid
                        hidden={!harSjekket || kanAvslutte}
                    >
                        <ul>
                            {underOppfolging &&
                                <li>
                                    <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.under-oppfolging" />
                                </li>}
                            {harYtelser &&
                                <li>
                                    <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.aktive-ytelser" />
                                </li>}
                            {harTiltak &&
                                <li>
                                    <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.aktive-tiltak" />
                                </li>}
                            {underKvp &&
                                <li>
                                    <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.under-kvp" />
                                </li>}
                        </ul>
                    </HiddenIfAlertStripeInfoSolid>
                </div>
            </StartProsess>
        );
    }
}

AvsluttOppfolgingProsess.defaultProps = {
    avslutningStatus: undefined,
};

AvsluttOppfolgingProsess.propTypes = {
    laster: PT.bool.isRequired,
    doKanAvslutteOppfolging: PT.func.isRequired,
    slettBegrunnelse: PT.func.isRequired,
    avslutningStatus: AppPT.avslutningStatus,
};

const mapStateToProps = state => ({
    avslutningStatus: selectAvslutningStatus(state),
    kanStarte: selectKanStarteOppfolging(state),
    laster: selectInnstillingerStatus(state) === STATUS.RELOADING,
});

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => dispatch(SLETT_BEGRUNNELSE_ACTION),
    doKanAvslutteOppfolging: () => dispatch(kanAvslutteOppfolging()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(AvsluttOppfolgingProsess)
);
