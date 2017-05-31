import React from 'react';
import PT from 'prop-types';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import { connect } from 'react-redux';
import Hovedknapp from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import ModalHeader from '../modal-header';
import ModalContainer from '../modal-container';
import ModalFooter from '../modal-footer';

function VisAdvarsel(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <ModalHeader />
            <div className="aktivitetvisning__underseksjon">
                <ModalContainer>
                    <Innholdstittel>
                        {props.headerTekst}
                    </Innholdstittel>
                    <AlertStripeInfoSolid>
                        <FormattedMessage id="ferdigstilt.advarsel.message" />
                    </AlertStripeInfoSolid>
                </ModalContainer>
            </div>
            <ModalFooter>
                <Hovedknapp mini>
                    <FormattedMessage id="ferdigstilt.modal.lagre" />
                </Hovedknapp>
            </ModalFooter>
        </form>
    );
}

VisAdvarsel.propTypes = {
    headerTekst: PT.element.isRequired,
    handleSubmit: PT.func.isRequired,
};

const BegrunnelseAktivitetReduxForm = reduxForm({
    form: 'bekreft-advarsel-aktivitet-form',
})(VisAdvarsel);

const mapDispatchToProps = () => ({});

export default connect(null, mapDispatchToProps)(BegrunnelseAktivitetReduxForm);
