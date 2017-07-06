import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Modal from '../../modal/modal';
import ModalHeader from '../../modal/modal-header';
import history from '../../history';

function FeilKvittering() {
    return (
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <ModalHeader />
            <article className="innstillinger__container">
                <Innholdstittel>
                    <FormattedMessage id="innstillinger.feilkvittering.overskrift" />
                </Innholdstittel>
                <AlertStripeAdvarsel className="blokk-m">
                    <FormattedMessage id="innstillinger.feilkvittering.feilmelding" />
                </AlertStripeAdvarsel>
            </article>
        </Modal>
    );
}

export default FeilKvittering;
