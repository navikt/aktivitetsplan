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
import AlertstripeListe from '../../../felles-komponenter/alertstripe-liste';
import { selectFeatureData } from '../../../felles-komponenter/feature/feature-selector';
import { harFeature } from '../../../felles-komponenter/feature/feature';

function lagAlertstripelisteConfig({
    underOppfolging,
    harYtelser,
    harTiltak,
    underKvp,
}) {
    return {
        'innstillinger.prosess.avslutt-oppfolging.feil.under-oppfolging': underOppfolging,
        'innstillinger.prosess.avslutt-oppfolging.feil.aktive-ytelser': harYtelser,
        'innstillinger.prosess.avslutt-oppfolging.feil.aktive-tiltak': harTiltak,
        'innstillinger.prosess.avslutt-oppfolging.feil.under-kvp': underKvp,
    };
}

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
        const {
            avslutningStatus,
            laster,
            slettBegrunnelse,
            features,
        } = this.props;
        const { underOppfolging, harYtelser, harTiltak, underKvp } =
            avslutningStatus || {};
        const { harSjekket, kanAvslutte } = this.state;
        return (
            <StartProsess
                className="innstillinger__prosess"
                tittelId="innstillinger.prosess.avslutt.tittel"
                knappetekstId="innstillinger.modal.prosess.start.knapp"
                laster={laster}
                disabled={harSjekket && !kanAvslutte}
                onClick={() => {
                    slettBegrunnelse();
                    this.gaTilBekreft('/innstillinger/avslutt');
                }}
            >
                <div className="blokk-xs">
                    <Normaltekst className="blokk-xs">
                        <FormattedMessage id="innstillinger.prosess.avslutt.tekst" />
                    </Normaltekst>
                    <AlertstripeListe
                        nopadding
                        nobullets={false}
                        hidden={!harSjekket || kanAvslutte}
                        config={lagAlertstripelisteConfig({
                            underOppfolging,
                            harYtelser:
                                !harFeature(
                                    'unngasjekkpagaendeytelser',
                                    features
                                ) && harYtelser,
                            harTiltak,
                            underKvp,
                        })}
                    >
                        <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.feil.forklaring" />
                    </AlertstripeListe>
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
    features: PT.object.isRequired,
};

const mapStateToProps = state => ({
    avslutningStatus: selectAvslutningStatus(state),
    kanStarte: selectKanStarteOppfolging(state),
    laster: selectInnstillingerStatus(state) === STATUS.RELOADING,
    features: selectFeatureData(state),
});

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => dispatch(SLETT_BEGRUNNELSE_ACTION),
    doKanAvslutteOppfolging: () => dispatch(kanAvslutteOppfolging()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(AvsluttOppfolgingProsess)
);
