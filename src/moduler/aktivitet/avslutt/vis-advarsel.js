import React from 'react';
import PT from 'prop-types';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import Hovedknapp from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import { validerReferatPublisert } from '../aktivitet-util';

function VisAdvarsel({ handleSubmit, headerTekst, errorSummary }) {
    return (
        <form onSubmit={handleSubmit}>
            <ModalContainer className="aktivitetvisning__underseksjon">
                <Innholdstittel>
                    {headerTekst}
                </Innholdstittel>
                {errorSummary}
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
    errorSummary: PT.node.isRequired,
};

const BegrunnelseAktivitetReduxForm = validForm({
    form: 'bekreft-advarsel-aktivitet-form',
    errorSummaryTitle: (
        <FormattedMessage id="ferdigstilt.feiloppsummering-tittel" />
    ),
    validate: {
        erReferatPublisert: validerReferatPublisert(),
    },
})(VisAdvarsel);

export default BegrunnelseAktivitetReduxForm;
