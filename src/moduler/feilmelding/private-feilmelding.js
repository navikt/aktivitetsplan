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
                            <FormattedMessage id="private.info.1" />
                        </Normaltekst>
                        <Normaltekst style={{ margin: '1rem 0 1rem 0' }}>
                            <FormattedMessage id="private.info.2" />
                        </Normaltekst>
                        <Normaltekst style={{ margin: '1rem 0 1rem 0' }}>
                            <FormattedMessage id="private.info.3" />
                        </Normaltekst>
                        <Normaltekst style={{ margin: '1rem 0 1rem 0' }}>
                            <FormattedMessage id="private.info.4" />
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
