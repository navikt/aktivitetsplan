import React from 'react';
import PT from 'prop-types';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import Hovedknapp from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';

function VisAdvarsel({ handleSubmit, headerTekst }) {
    return (
        <form onSubmit={handleSubmit}>
            <ModalHeader />
            <ModalContainer className="aktivitetvisning__underseksjon">
                <Innholdstittel>
                    {headerTekst}
                </Innholdstittel>
                <AlertStripeInfoSolid>
                    <FormattedMessage id="ferdigstilt.modal.message" />
                </AlertStripeInfoSolid>
            </ModalContainer>
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

export default BegrunnelseAktivitetReduxForm;
