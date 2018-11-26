import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import NavFrontendModal from 'nav-frontend-modal';
import { autobind } from '../../utils';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import { erPrivateBrukerSomSkalSkrusAv } from '../privat-modus/privat-modus-selector';

// todo: remove me when private-mode is gone

class PrivateFeilmelding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: true,
        };

        autobind(this);
    }

    lukk() {
        this.setState({ apen: false });
    }

    vis() {
        this.setState({ apen: true });
    }

    render() {
        const { skalVises } = this.props;

        return (
            <VisibleIfDiv visible={skalVises} className="container feilmelding">
                <AlertStripeAdvarselSolid>
                    <FormattedMessage id="private.advarsel" />{' '}
                    <Knappelenke
                        style={{ color: 'white', textDecoration: 'underline' }}
                        onClick={this.vis}
                    >
                        Se mer informasjon
                    </Knappelenke>
                </AlertStripeAdvarselSolid>

                <NavFrontendModal
                    isOpen={this.state.apen}
                    shouldCloseOnOverlayClick={false}
                    className="aktivitet-modal"
                    overlayClassName="aktivitet-modal__overlay"
                    portalClassName="aktivitetsplanfs aktivitet-modal-portal"
                    onRequestClose={this.lukk}
                >
                    <ModalHeader />
                    <div className="aktivitetvisning__underseksjon">
                        <Sidetittel>
                            <FormattedMessage id="private.info.header" />
                        </Sidetittel>
                        <Normaltekst style={{ margin: '1rem 0 1rem 0' }}>
                            NAV vil fra nå bare tilby aktivitetsplanen som en
                            tjeneste til registrerte arbeidssøkere med
                            oppfølging fra NAV. Hvis du ikke er registrert som
                            arbeidssøker, vil du ikke kunne ta i bruk
                            aktivitetsplanen.
                        </Normaltekst>
                        <Normaltekst style={{ margin: '1rem 0 1rem 0' }}>
                            <b>
                                Til deg som ikke er registrert som arbeidssøker
                            </b>
                            <br />
                            Hvis du allerede har lagt inn aktiviteter i
                            aktivitetsplanen, men ikke er registrert som
                            arbeidssøker, kan du skrive ut eller slette
                            informasjon i planen fram til 3.januar 2019. Du kan
                            skrive ut ved å klikke på ikonet for utskrift.
                        </Normaltekst>
                        <Normaltekst style={{ margin: '1rem 0 1rem 0' }}>
                            3.januar 2019 blir alt du har lagt inn slettet og du
                            vil ikke lenger ha tilgang til planen.
                        </Normaltekst>
                        <Normaltekst style={{ margin: '1rem 0 1rem 0' }}>
                            <b>
                                Til deg som har vært registrert som arbeidssøker
                            </b>
                            <br />
                            Hvis du tidligere har vært registrert som
                            arbeidssøker og brukt aktivitetsplanen, kan du se
                            tidligere aktivitetsplaner, under Mine historiske
                            planer.
                        </Normaltekst>
                        <Hovedknapp onClick={this.lukk}>
                            <FormattedMessage id="private.forstatt" />
                        </Hovedknapp>
                    </div>
                </NavFrontendModal>
            </VisibleIfDiv>
        );
    }
}

PrivateFeilmelding.defaultProps = {
    skalVises: true,
};

PrivateFeilmelding.propTypes = {
    skalVises: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    skalVises: erPrivateBrukerSomSkalSkrusAv(state),
});

export default connect(mapStateToProps)(PrivateFeilmelding);
