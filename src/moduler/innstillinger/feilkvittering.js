import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
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
                <div className="blokk-xs">
                    <Innholdstittel>
                        <FormattedMessage id="innstillinger.feilkvittering.overskrift" />
                    </Innholdstittel>
                </div>
                <AlertStripeAdvarsel className="blokk-m">
                    <FormattedMessage id="innstillinger.feilkvittering.feilmelding" />
                </AlertStripeAdvarsel>
            </article>
        </Modal>
    );
}

export default FeilKvittering;
